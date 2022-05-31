/*
    Program: main.js
    Programmer: Mallory Kowalski
    Date: April 15, 2022
    Purpose: To create a scene view map with custom client-side feature layer(s) and 3D widgets.
*/

require(["esri/config",
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/WebTileLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Daylight",
    "esri/widgets/LineOfSight",
    "esri/widgets/ElevationProfile",
    "esri/widgets/Home",
    "esri/widgets/Expand",
    "esri/widgets/LayerList",
    "esri/widgets/Legend",
    "esri/layers/MapImageLayer",
    "esri/widgets/Search",
    "esri/widgets/TimeSlider",
    "esri/layers/TileLayer",
    "esri/layers/ElevationLayer"],
    function (esriConfig, Map, SceneView, WebTileLayer, FeatureLayer, BasemapToggle,
        Daylight, LineOfSight, ElevationProfile, Home, Expand, LayerList, Legend, MapImageLayer, Search, TimeSlider, TileLayer, ElevationLayer) {

        // new esriConfig
        esriConfig.apiKey = "AAPK7dce78d141b04a0b828d6ed8612a1444E5EsipESmKv4j_PW3GtdLlL_e1Qqj0V7DM62fNqA4a7aG7e0GoW0LiHQn-nX1OAK";

        // // create a WebTileLayer with a third-party cached service 
        const mapBaseLayer = new WebTileLayer({
            urlTemplate: "https://stamen-tiles-{subDomain}.a.ssl.fastly.net/terrain/{level}/{col}/{row}.png",
            subDomains: ["a", "b", "c", "d"],
            copyright:
                'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ' +
                'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
                'Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, ' +
                'under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
        });

        // create popup for pictou towers feature layer
        const towersPopupTemplate = {
            title: "5Ghz Pictou Towers",
            content: [
                {
                    type: "fields",
                    fieldInfos: [{
                        fieldName: "site",
                        label: "Tower Site: "
                    },
                    {
                        fieldName: "tlon",
                        label: "Longitude: ",
                        format: {
                            places: 5,
                        }
                    },
                    {
                        fieldName: "tlat",
                        label: "Latitude: ",
                        format: {
                            places: 5,
                        }
                    },
                    {
                        fieldName: "structure",
                        label: "Structure: ",
                    },
                    {
                        fieldName: "structure",
                        label: "Structure: ",
                    },
                    {
                        fieldName: "date_onlin",
                        label: "Expected Date Online: "
                    },
                    {
                        fieldName: "hgt_orig",
                        label: "Tower Height: "
                    }]
                }
            ]
        };

        // create layer for pictou civic addresses feature layer
        const civicsPopupTemplate = {
            title: "Pictou Civic Addresses",
            content: [
                {
                    type: "fields",
                    fieldInfos: [{
                       fieldName: "CivicNumbe",
                        label: "Civic Number: "
                    },
                    {
                        fieldName: "Street",
                        label: "Street Name: "
                    },
                    {
                        fieldName: "X",
                        label: "Longitude: ",
                        format: {
                            places: 5,
                        }
                    },
                    {
                        fieldName: "Y",
                        label: "Latitude: ",
                        format: {
                            places: 5,
                        }
                    },
                    {
                        fieldName: "serAvail",
                        label: "Service Available: ",
                    },
                    {
                        fieldName: "serDate",
                        label: "Expected Date Online: "
                    },
                    {
                        fieldName: "height_max",
                        label: "Height: "
                    }]
                }
            ]
        };

        // create popup for pictou power pole locations
        const polePopupTemplate = {
            title: "Pictou Power Pole Locations",
            content: [
                {
                    type: "fields",
                    fieldInfos: [{
                        fieldName: "civicadd",
                        label: "Address: "
                    },
                    {
                        fieldName: "x",
                        label: "X Location: ",
                        format: {
                            places: 3,
                        }
                    },
                    {
                        fieldName: "y",
                        label: "Y Location: ",
                        format: {
                            places: 3,
                        }
                    },
                    {
                        fieldName: "owner",
                        label: "Owner: ",
                    },
                    {
                        fieldName: "bellpoleid",
                        label: "Bell Pole ID: ",
                    },
                    {
                        fieldName: "nspid",
                        label: "Nova Scotia Pole ID: ",
                    },
                    {
                        fieldName: "poletype",
                        label: "Type: ",
                    },
                    {
                        fieldName: "poleclass",
                        label: "Class: ",
                    },]
                }
            ]
        };

        // create pictou boundary polygon symbol
        let polygonSymbol = {
            type: "line-3d",  // autocasts as new PolygonSymbol3D()
            symbolLayers: [{
                type: "line",   // autocasts as new ExtrudeSymbol3DLayer()
                material: { color: "green" },
                pattern: {  // autocasts as new LineStylePattern3D()
                    type: "style",
                    style: "solid"
                },
            }]
        };
    
        // Create tower symbol with time data
        const pictouTowerSymbol = {
            type: "point-3d", // autocasts as new PointSymbol3D()
            symbolLayers: [
                {
                    type: "object", // autocasts as new ObjectSymbol3DLayer()
                    width: 5,
                    height: 32, //32 metres
                    size: 2,
                    resource: {
                        primitive: "cylinder"
                    },
                    material: {
                        color: "green"
                    }
                }
            ]
        };

        // Create tower symbol 
        const pictouTowerSymbol = {
            type: "point-3d", // autocasts as new PointSymbol3D()
            symbolLayers: [
                {
                    type: "object", // autocasts as new ObjectSymbol3DLayer()
                    width: 5,
                    height: 50, //32 metres
                    size: 2,
                    resource: {
                        primitive: "cylinder"
                    },
                    material: {
                        color: "red"
                    }
                }
            ]
        };

        // Create power pole symbol 
        const poleSymbol = {
            type: "point-3d", // autocasts as new PointSymbol3D()
            symbolLayers: [
                {
                    type: "object", // autocasts as new ObjectSymbol3DLayer()
                    width: 3,
                    height: 10.7,
                    size: 2,
                    resource: {
                        primitive: "cylinder"
                    },
                    material: {
                        color: "orange"
                    }
                }
            ]
        };

        // Create civics symbol 
        const civicsSymbol = {
            type: "point-3d", // autocasts as new PointSymbol3D()
            symbolLayers: [
                {
                    type: "object", // autocasts as new ObjectSymbol3DLayer()
                    width: 6,
                    height: 6,
                    resource: {
                        primitive: "cylinder"
                    },
                    material: {
                        color: "blue"
                    }
                }
            ]
        };
    
        // Create civics symbol with time data
        const civicsWithDatesSymbol = {
            type: "point-3d", // autocasts as new PointSymbol3D()
            symbolLayers: [
                {
                    type: "object", // autocasts as new ObjectSymbol3DLayer()
                    width: 6,
                    height: 6,
                    resource: {
                        primitive: "cylinder"
                    },
                    material: {
                        color: "green"
                    }
                }
            ]
        };

        // create roads symbol
        // const roadSymbol = {
        //     type: "line-3d",  // autocasts as new LineSymbol3D()
        //     symbolLayers: [{
        //         type: "line",  // autocasts as new LineSymbol3DLayer()
        //         size: 1,  // points
        //         material: { color: "purple" },
        //         cap: "round",
        //         join: "round",
        //         pattern: {  // autocasts as new LineStylePattern3D()
        //             type: "style",
        //         },
        //     }]
        // };

        // create renderer for pictou polygon
        const pictouPolygonRenderer = {
            type: "simple", // autocasts as new SimpleRenderer()
            symbol: polygonSymbol
        };

        // create renderer for pictou power poles
        const pictouPolesRenderer = {
            type: "simple", // autocasts as new SimpleRenderer()
            symbol: poleSymbol
        };

        // create renderer for pictou towers
        const pictouTowerRenderer = {
            type: "simple", // autocasts as new SimpleRenderer()
            symbol: pictouTowerSymbol
        };

        // create renderer for pictou civic addresses
        const pictouCivicsRenderer = {
            type: "simple", // autocasts as new SimpleRenderer()
            symbol: civicsSymbol
        };

        // Keeping code for future reference 
        // create renderer for pictou roads
        // const pictouRoadsRenderer = {
        //     type: "simple", // autocasts as new SimpleRenderer()
        //     symbol: roadSymbol
        // };        

        // Create Pictou Boundary polygon feature layer 
        let pictouBoundary = new FeatureLayer({
            url: "https://services3.arcgis.com/K5W1VzTTp09kCUqY/arcgis/rest/services/pictouboundary/FeatureServer/0",
            title: "Pictou Boundary",
            renderer: pictouPolygonRenderer,
            copyright: "MOPC and Open Data Portal",
        });

        // Create Pictou Civics points feature layer 
        let pictouCivics = new FeatureLayer({
            url: "https://services3.arcgis.com/K5W1VzTTp09kCUqY/arcgis/rest/services/civics_proper_date/FeatureServer/0",
            title: "Pictou Civics",
            renderer: pictouCivicsWithDatesRenderer,
            popupTemplate: civicsPopupTemplate,
            copyright: "MOPC and Open Data Portal",
        });

        // Create Pictou Civics with no dates points feature layer 
        let pictouCivicsNoDates = new FeatureLayer({
            url: "https://services3.arcgis.com/K5W1VzTTp09kCUqY/arcgis/rest/services/civics_date_height/FeatureServer/0",
            //url: "https://services3.arcgis.com/K5W1VzTTp09kCUqY/arcgis/rest/services/civics_no_date/FeatureServer/0",
            title: "Pictou Civics",
            renderer: pictouCivicsRenderer,
            popupTemplate: civicsPopupTemplate,
            copyright: "MOPC and Open Data Portal",
        });

        // Create Pictou Towers point feature layer 
        let pictouTowers = new FeatureLayer({
            url: "https://services3.arcgis.com/K5W1VzTTp09kCUqY/arcgis/rest/services/towers_with_date/FeatureServer/0",
            title: "Pictou Towers",
            renderer: pictouTowerRenderer,
            popupTemplate: towersPopupTemplate,
            copyright: "PHNX Technologies",
        });

        // Create Pictou Towers point feature layer 
        let pictouTowersNoDates = new FeatureLayer({
            url: "https://services3.arcgis.com/K5W1VzTTp09kCUqY/arcgis/rest/services/towers_nodates/FeatureServer/0",
            title: "Pictou Towers",
            renderer: pictouTowerNoDateRenderer,
            popupTemplate: towersPopupTemplate,
            copyright: "PHNX Technologies",
        });

        // Create Pictou Poles point feature layer 
        let pictouPoles = new FeatureLayer({
            url: "https://services3.arcgis.com/K5W1VzTTp09kCUqY/arcgis/rest/services/pole_3857/FeatureServer/0",
            title: "Pictou Poles",
            renderer: pictouPolesRenderer,
            popupTemplate: polePopupTemplate,
            copyright: "PHNX Technologies Lidar drive through",
        });

        // Could not get roads to display properly as a feature layer 
        // Create Pictou Roads point feature layer 
        // let pictouRoads = new FeatureLayer({
        //     //url: "https://nsgiwa.novascotia.ca/arcgis/rest/services/BASE/BASE_NSTDB_10k_Roads_UT83/MapServer",
        //     url: "https://services3.arcgis.com/K5W1VzTTp09kCUqY/arcgis/rest/services/pictou_roads/FeatureServer/0",
        //     //url: "https://services3.arcgis.com/K5W1VzTTp09kCUqY/arcgis/rest/services/roads_3857/FeatureServer/0",
        //     // these commented out urls were an attempt to make the road symbology show up correctly on the map
        //     // by re-projecting the layers in QGIS
        //     //url: "https://services3.arcgis.com/K5W1VzTTp09kCUqY/arcgis/rest/services/roads_3857_2/FeatureServer/0",            
        //     //url: "https://services3.arcgis.com/K5W1VzTTp09kCUqY/arcgis/rest/services/pictouroads/FeatureServer/0",
        //     title: "Pictou Roads",
        //     //renderer: pictouRoadsRenderer,
        //     copyright: "MOPC and Open Data Portal",
        // });

        // DSM Clutter Layer added as new Tile Layer
        //let pictouDSMLayer = new TileLayer({
            // Custom elevation service
            //url: "https://tiles.arcgis.com/tiles/9PtzeAadJyclx9t7/arcgis/rest/services/Pictou_DSM_2m_ProjectRaster_2/MapServer"
          //});
        

        // add NS Roads
        const NSRoads = new MapImageLayer({
            //url: "https://services3.arcgis.com/K5W1VzTTp09kCUqY/arcgis/rest/services/arc_roads/FeatureServer/0",
            //url: "https://services3.arcgis.com/K5W1VzTTp09kCUqY/arcgis/rest/services/pictou_roads/FeatureServer/0",
            url: "https://nsgiwa.novascotia.ca/arcgis/rest/services/TRNS/TRNS_NSRN_Addressed_Roads_UT83/MapServer",
            title: "NS Roads",
            copyright: "GeoNova"

        });

        // create a map
        const myMap = new Map({
            basemap: "hybrid",
            ground: "world-elevation",
            // add feature layers to map
            layers: [
                // new TileLayer({
                //     url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
                // }),
                pictouBoundary, NSRoads, pictouCivics, pictouCivicsNoDates, pictouTowersNoDates, pictouTowers, pictouPoles, pictouDSMLayer],
        });


        //myMap.layers.add(pictouRoads);

        // Create a basic SceneView instance with a basemap and world elevation
        const view = new SceneView({
            // An instance of Map or WebScene
            map: myMap,
            spatialReference: {
                wkid: 3857
             },
            // The id of a DOM element (may also be an actual DOM element)
            container: "viewDiv",
            camera: {
                position: [
                    -62.660602, // lon
                    45.485444,      // lat
                    250  // elevation in meters
                ],
                tilt: 86,
                //heading: 20
            }

        });

        // create Basemap Toggle wideget
        //let basemapToggle = new BasemapToggle({
            //view: view,
            //nextBasemap: "arcgis-topographic"
        //});

        // add Basemap toggle widget to map
        //view.ui.add(basemapToggle, { position: "top-right" });

        // add line of sight widget 
        const lineOfSight = new LineOfSight({
            view: view
        });


        // create elevation profile widget
        const elevationProfile = new ElevationProfile({
            view: view,
            profiles: [{
                // displays elevation values from Map.ground
                type: "ground", //autocasts as new ElevationProfileLineGround()
                color: "#61d4a4",
                title: "Ground elevation"
            }, {
                // displays elevation values from a SceneView
                type: "view", //autocasts as new ElevationProfileLineView()
                color: "#8f61d4",
                title: "View elevation"
            }],
            visibleElements: {
                selectButton: false
            }
        });

        // create home widget 
        let homeWidget = new Home({
            view: view
        });

        // adds the home widget to the top left corner of the MapView
        view.ui.add(homeWidget, "top-left");

        // create daylight widget
        const measurement = new DirectLineMeasurement3D({
            view: view,
            activeTool: "distance"
        });

        // create layer list widget
        let layerlist = new LayerList({
            view: view
        });

        // create legend widget
        let legend = new Legend({
            view: view
        });
    
            // // time slider widget initialization
        const timeSlider = new TimeSlider({
            container: "timeSliderDiv",
            view: view,
            // show data within a given time range
            // in this case data within one year
            mode: "time-window",
            fullTimeExtent: { // entire extent of the timeSlider
                start: new Date(2022, 5, 1),
                end: new Date(2023, 5, 1)
            },
            timeExtent: { // location of timeSlider thumbs
                start: new Date(2022, 5, 1),
                end: new Date(2023, 5, 1)
            }
        });

        // create expand widget for elevation profile
        const elevationProfileExpand = new Expand({
            view: view,
            content: elevationProfile,
            container: document.createElement("widgetsDiv"),
            group: "top-right"
        });

        // create expand widget for measurement
        const measurementExpand = new Expand({
            view: view,
            content: measurement,
            container: "widgetsDiv",
            group: "top-right"
        });


        // create expand widget for line of sight
        const lineOfSightExpand = new Expand({
            view: view,
            content: lineOfSight,
            container: "widgetsDiv",
            group: "top-right"
        });

        // create expand widget for line of sight
        const layerlistExpand = new Expand({
            view: view,
            content: layerlist,
            container: "widgetsDiv",
            group: "bottom-left"
        });

        // create expand widget for line of sight
        const legendExpand = new Expand({
            view: view,
            content: legend,
            container: "widgetsDiv",
            group: "bottom-left"
        });
    
        // create search wdiget
        const searchWidget = new Search({
            view: view
        });
        // Adds the search widget below other elements in
        // the top left corner of the view
        view.ui.add(searchWidget, {
            position: "bottom-right",
            index: 2
        });

        // add layer list and legend expand widgets to bottom left of map
        view.ui.add([layerlistExpand, legendExpand, timeSlider,], "bottom-left"); 

        // add elevation profile, daylight, and line of sight expand widgets to top right of map
        view.ui.add([elevationProfileExpand, measurementExpand, lineOfSightExpand,], "top-right");

    });








