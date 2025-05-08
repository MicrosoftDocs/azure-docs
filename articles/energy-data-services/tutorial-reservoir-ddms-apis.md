---
title: "Tutorial: Use Reservoir DDMS APIs to work with reservoir data"
titleSuffix: Microsoft Azure Data Manager for Energy
description: "Learn to use OSDU Reservoir DDMS APIs."
author: bharathim
ms.author: bselvaraj
ms.service: azure-data-manager-energy
ms.topic: tutorial  #Don't change.
ms.date: 02/12/2025

#customer intent: As a Data Manager, I want to learn how to use OSDU Reservoir DDMS APIs to read reservoir data.

---
# Tutorial: Use Reservoir DDMS API endpoints

In this article, you learn how to read data from Reservoir DDMS REST APIs with curl commands. 

> [!IMPORTANT]
> In the current release, only Reservoir DDMS read APIs are supported.

## Prerequisites

- Create an Azure Data Manager for Energy resource. See [How to create Azure Data Manager for Energy resource](quickstart-create-microsoft-energy-data-services-instance.md).
- Generate the service principal access token to call the reservoir DDMS APIs. See [How to generate auth token](how-to-generate-auth-token.md).

## Use Reservoir DDMS APIs to read reservoir data
1. To check the client health, run the following curl command in Azure Cloud Shell.

    ```bash
    curl --request GET \
      --url https://<adme_url>/api/reservoir-ddms/v2/health/info \
      --header 'Authorization: Bearer <access-token>' \
      --header 'data-partition-id: <data-partition-id>'
    ```

    **Sample Response:**
    ```json
    {
        "groupId": "org.opengroup.osdu",
        "artifactId": "@osdu/open-etp-client",
        "version": "1.2.0",
        "commitId": "unknown",
        "commitTime": "unknown"
    }
    ```
1. Run the following curl command to list all the dataspaces.

    ```bash
    curl --request GET \
      --url https://<adme_url>/api/reservoir-ddms/v2/dataspaces \
      --header 'Authorization: Bearer <access-token>' \
      --header 'data-partition-id: <data-partition-id>'
    ```
    **Sample Response**
    ```json
    [
    	{
    		"uri": "eml:///dataspace('demo/Volve')",
    		"path": "demo/Volve",
    		"storeLastWrite": "2025-02-04T13:34:18.901Z",
    		"storeCreated": "2025-02-04T13:34:18.901Z",
    		"customData": {
    			"read-only": "false",
    			"size": "232 kB"
    		}
    	}
    ]
    ```

1. Run the following curl command to get the summary of content in a data space.
    ```bash
    curl --request GET \
      --url https://<adme_url>/api/reservoir-ddms/v2/dataspaces/<dataspace_name>/resources \
      --header 'Authorization: Bearer <access-token>' \
      --header 'data-partition-id: <data-partition-id>'
    ```
    
    **Sample Request**
    
    Consider an Azure Data Manager for Energy resource named `admetest` with a data partition named `dp1` and data space name is `demo/Volve`
    
    ```bash
    curl --request GET \
      --url https://admetest.energy.azure.com/api/reservoir-ddms/v2/dataspaces/demo%2FVolve/resources \
      --header 'Authorization: Bearer ey......' \
      --header 'data-partition-id: dp1'
    ```
    
    **Sample Response**
    ```json
    [
    	{
    		"name": "eml20.obj_EpcExternalPartReference",
    		"count": 1
    	},
    	{
    		"name": "resqml20.obj_ContinuousProperty",
    		"count": 10
    	},
    	{
    		"name": "resqml20.obj_GeneticBoundaryFeature",
    		"count": 7
    	},
    	{
    		"name": "resqml20.obj_Grid2dRepresentation",
    		"count": 5
    	},
    	{
    		"name": "resqml20.obj_HorizonInterpretation",
    		"count": 6
    	},
    	{
    		"name": "resqml20.obj_LocalDepth3dCrs",
    		"count": 1
    	},
    	{
    		"name": "resqml20.obj_OrganizationFeature",
    		"count": 1
    	},
    	{
    		"name": "resqml20.obj_PropertyKind",
    		"count": 6
    	},
    	{
    		"name": "resqml20.obj_StratigraphicColumn",
    		"count": 2
    	},
    	{
    		"name": "resqml20.obj_StratigraphicColumnRankInterpretation",
    		"count": 2
    	},
    	{
    		"name": "resqml20.obj_StratigraphicUnitFeature",
    		"count": 8
    	},
    	{
    		"name": "resqml20.obj_StratigraphicUnitInterpretation",
    		"count": 16
    	},
    	{
    		"name": "resqml20.obj_SubRepresentation",
    		"count": 21
    	},
    	{
    		"name": "resqml20.obj_TriangulatedSetRepresentation",
    		"count": 3
    	}
    ]
    ```

1. Run the following curl command to get the all the resources details in a data space.
    ```bash
    curl --request GET \
      --url https://<adme_url>/api/reservoir-ddms/v2/dataspaces/<dataspace_name>/resources/all \
      --header 'Authorization: Bearer bearer' \
      --header 'data-partition-id: <data-partition-id>'
    ```
    **Sample Response**
    ```json
    [
    	{
    		"uri": "eml:///dataspace('demo/Volve')/resqml20.obj_ContinuousProperty(0ea90494-08f9-48e8-bc28-6cbc70a64626)",
    		"alternateUris": [],
    		"name": "SnS_data_mismatch",
    		"lastChanged": "2019-01-03T17:10:16.000Z",
    		"storeLastWrite": "2025-02-05T11:33:11.766Z",
    		"storeCreated": "2025-02-05T11:33:11.766Z",
    		"activeStatus": "Active",
    		"customData": {
    			"created": "2019-01-03T17:10:16.000Z",
    			"creator": "ATsoblefack"
    		}
    	},
    	{
    		"uri": "eml:///dataspace('demo/Volve')/resqml20.obj_ContinuousProperty(1615d8d2-2a2d-482c-885e-14225b89e90c)",
    		"alternateUris": [],
    		"name": "Thick",
    		"lastChanged": "2019-01-08T13:42:27.000Z",
    		"storeLastWrite": "2025-02-05T11:33:11.766Z",
    		"storeCreated": "2025-02-05T11:33:11.766Z",
    		"activeStatus": "Active",
    		"customData": {
    			"created": "2019-01-08T13:42:26.000Z",
    			"creator": "ATsoblefack"
    		}
    	}
    ]
    ```

1. Run the following curl command to get all the resources in a dataspace filtered on object type.

    ```bash
    curl --request GET \
      --url https://<adme_url>/api/reservoir-ddms/v2/dataspaces/<dataspace-name>/resources/<data-object-type> \
      --header 'Authorization: Bearer <access-token>' \
      --header 'data-partition-id: <data-partition-id>'
    ```
    **Sample Request**
    
    Consider an Azure Data Manager for Energy resource named `admetest` with a data partition named `dp1` and data space name is `demo/volve`. You want to get all the `Grid2dRepresentation` type resources.
    ```bash
    curl --request GET \
      --url https://admetest.energy.azure.com/api/reservoir-ddms/v2/dataspaces/demo%2FVolve/resources/resqml20.obj_Grid2dRepresentation \
      --header 'Authorization: Bearer ey........' \
      --header 'data-partition-id: dp1'
    ```
    **Sample Response**
    ```json
    [
    	{
    		"uri": "eml:///dataspace('demo/Volve')/resqml20.obj_Grid2dRepresentation(07cb9ebb-299f-469b-9792-e76633a72b89)",
    		"alternateUris": [],
    		"name": "ConvHugin_Fm_Base",
    		"lastChanged": "2019-01-03T17:11:21.000Z",
    		"storeLastWrite": "2025-02-05T11:33:11.766Z",
    		"storeCreated": "2025-02-05T11:33:11.766Z",
    		"activeStatus": "Active",
    		"customData": {
    			"created": "2019-01-03T17:11:20.000Z",
    			"creator": "ATsoblefack"
    		}
    	},
    	{
    		"uri": "eml:///dataspace('demo/Volve')/resqml20.obj_Grid2dRepresentation(8f2c2911-5cdc-4133-ab98-be7a3f94de32)",
    		"alternateUris": [],
    		"name": "Hugin_Fm_Base",
    		"lastChanged": "2019-01-03T17:08:58.000Z",
    		"storeLastWrite": "2025-02-05T11:33:11.766Z",
    		"storeCreated": "2025-02-05T11:33:11.766Z",
    		"activeStatus": "Active",
    		"customData": {
    			"created": "2019-01-03T17:08:58.000Z",
    			"creator": "ATsoblefack"
    		}
        }
    ]
    ```

1. Run the following curl command to get details like metadata of a representation based on data object type guid.

    ```bash
    curl --request GET \
      --url https://<adme_url>/api/reservoir-ddms/v2/dataspaces/<dataspace-name>/resources/<data-object-type>/<data-object-type-guid> \
      --header 'Authorization: Bearer <access-token>' \
      --header 'data-partition-id: <data-partition-id>'
    ```
    
    **Sample Request**
    
    Consider an Azure Data Manager for Energy resource named `admetest` with a data partition named `dp1` and data space name is `demo/volve`. You want to get details of object type `Grid2dRepresentation` with data object guid `07cb9ebb-299f-469b-9792-e76633a72b89`
    
    ```bash
    curl --request GET \
      --url https://admetest.energy.azure.com/api/reservoir-ddms/v2/dataspaces/demo%2FVolve/resources/resqml20.obj_Grid2dRepresentation/07cb9ebb-299f-469b-9792-e76633a72b89 \
      --header 'Authorization: Bearer ey.....' \
      --header 'data-partition-id: dp1'
    ```
    **Sample Response**
    ```json
    [
    	{
    		"$type": "resqml20.obj_Grid2dRepresentation",
    		"SchemaVersion": "2.0",
    		"Uuid": "07cb9ebb-299f-469b-9792-e76633a72b89",
    		"Citation": {
    			"$type": "eml20.Citation",
    			"Title": "ConvHugin_Fm_Base",
    			"Originator": "ATsoblefack",
    			"Creation": "2019-01-03T17:11:20.000Z",
    			"Format": "Paradigm SKUA-GOCAD 22 Alpha 1 Build:20210830-0200 (id: origin/master|56050|1fb1cf919c2|20210827-1108) for Linux_x64_2.17_gcc91",
    			"Editor": "ATsoblefack",
    			"LastUpdate": "2019-01-03T17:11:21.000Z"
    		},
    		"ExtraMetadata": [
    			{
    				"$type": "resqml20.NameValuePair",
    				"Name": "pdgm/dx/resqml/creatorGroup",
    				"Value": "ATsoblefack"
    			}
    		],
    		"RepresentedInterpretation": {
    			"$type": "eml20.DataObjectReference",
    			"ContentType": "application/x-resqml+xml;version=2.0;type=obj_HorizonInterpretation",
    			"Title": "RP_Markers_Calibration",
    			"UUID": "e33006db-2797-4cdf-a4f2-8207b4688b3a",
    			"UuidAuthority": "pdgm",
    			"_data": {
    				"$type": "resqml20.obj_HorizonInterpretation",
    				"SchemaVersion": "2.0",
    				"Uuid": "e33006db-2797-4cdf-a4f2-8207b4688b3a",
    				"Citation": {
    					"$type": "eml20.Citation",
    					"Title": "RP_Markers_Calibration",
    					"Originator": "dalsaab",
    					"Creation": "2021-09-06T14:20:48.000Z",
    					"Format": "Paradigm SKUA-GOCAD 22 Alpha 1 Build:20210830-0200 (id: origin/master|56050|1fb1cf919c2|20210827-1108) for Linux_x64_2.17_gcc91"
    				},
    				"ExtraMetadata": [
    					{
    						"$type": "resqml20.NameValuePair",
    						"Name": "pdgm/dx/resqml/creatorGroup",
    						"Value": "dalsaab"
    					}
    				],
    				"Domain": "depth",
    				"InterpretedFeature": {
    					"$type": "eml20.DataObjectReference",
    					"ContentType": "application/x-resqml+xml;version=2.0;type=obj_GeneticBoundaryFeature",
    					"Title": "Hugin_Fm_Base",
    					"UUID": "bccee857-efb8-4562-aed7-19e5621526c4",
    					"UuidAuthority": "pdgm",
    					"_data": {
    						"$type": "resqml20.obj_GeneticBoundaryFeature",
    						"SchemaVersion": "2.0",
    						"Uuid": "bccee857-efb8-4562-aed7-19e5621526c4",
    						"Citation": {
    							"$type": "eml20.Citation",
    							"Title": "Hugin_Fm_Base",
    							"Originator": "jmaksoud",
    							"Creation": "2018-11-23T15:01:42.000Z",
    							"Format": "Paradigm SKUA-GOCAD 22 Alpha 1 Build:20210830-0200 (id: origin/master|56050|1fb1cf919c2|20210827-1108) for Linux_x64_2.17_gcc91",
    							"Editor": "dalsaab",
    							"LastUpdate": "2018-11-23T15:58:48.000Z"
    						},
    						"ExtraMetadata": [
    							{
    								"$type": "resqml20.NameValuePair",
    								"Name": "pdgm/dx/resqml/creatorGroup",
    								"Value": "jmaksoud"
    							}
    						],
    						"GeneticBoundaryKind": "horizon"
    					}
    				},
    				"BoundaryRelation": [
    					"conformable"
    				]
    			}
    		}
    	}
    ]
    ```

1. Run the following curl command to get the description of all arrays for a data object guid for a particular data object type.
    ```bash
    curl --request GET \
      --url https://<adme_url>/api/reservoir-ddms/v2/dataspaces/<dataspace-name>/resources/<data-object-type>/<data-object-type-guid>/arrays \
      --header 'Authorization: Bearer <access-token>' \
      --header 'data-partition-id: <data-partition-id>'
    ```
    **Sample Request**
    
    Consider an Azure Data Manager for Energy resource named `admetest` with a data partition named `dp1` and data space name is `demo/Volve`. You want to get arrays of object type `Grid2dRepresentation` with data object guid `07cb9ebb-299f-469b-9792-e76633a72b89`
    ```bash
    curl --request GET \
      --url https://admetest.energy.azure.com/api/reservoir-ddms/v2/dataspaces/demo%2FVolve/resources/resqml20.obj_Grid2dRepresentation/07cb9ebb-299f-469b-9792-e76633a72b89/arrays \
      --header 'Authorization: Bearer ey........' \
      --header 'data-partition-id: dp1'
    ```
    **Sample Response**
    ```json
    [
    	{
    		"uid": {
    			"uri": "eml:///dataspace('demo/Volve')/eml20.obj_EpcExternalPartReference(53395ada-6f93-4bac-b506-d45997ded2a2)",
    			"pathInResource": "/RESQML/07cb9ebb-299f-469b-9792-e76633a72b89/points_patch0"
    		},
    		"dimensions": [
    			401,
    			510
    		],
    		"arrayType": "Int8Array",
    		"preferredSubarrayDimensions": [],
    		"storeLastWrite": "1970-01-01T00:00:00.000Z",
    		"storeCreated": "1970-01-01T00:00:00.000Z",
    		"customData": {}
    	}
    ]
    ```

1. Run the following curl command to get the array as json for a specific path in resource.
    ```bash
    curl --request GET \
      --url https://<adme_url>/api/reservoir-ddms/v2/dataspaces/<dataspace-name>/resources/<data-object-type>/<data-object-type-guid>/arrays/<path-in-resource> \
      --header 'Authorization: Bearer <access-token>' \
      --header 'data-partition-id: <data-partition-id>'
    ```
    **Sample Request**
    
    Consider an Azure Data Manager for Energy resource named `admetest` with a data partition named `dp1` and data space name is `demo/Volve`. You want to get array with path is resource as `RESQML/07cb9ebb-299f-469b-9792-e76633a72b89/points_patch0` of object type `Grid2dRepresentation` with data object guid `07cb9ebb-299f-469b-9792-e76633a72b89`.
    ```bash
    curl --request GET \
      --url https://admetest.energy.azure.com/api/reservoir-ddms/v2/dataspaces/demo%2FVolve/resources/resqml20.obj_Grid2dRepresentation/07cb9ebb-299f-469b-9792-e76633a72b89/arrays/RESQML%2F07cb9ebb-299f-469b-9792-e76633a72b89%2Fpoints_patch0 \
      --header 'Authorization: Bearer ey........' \
      --header 'data-partition-id: dp1'
    ```
    **Sample Response**
    ```json
    {
    	"uid": {
    		"uri": "eml:///dataspace('demo/Volve')/resqml20.obj_Grid2dRepresentation(07cb9ebb-299f-469b-9792-e76633a72b89)",
    		"pathInResource": "RESQML/07cb9ebb-299f-469b-9792-e76633a72b89/points_patch0"
    	},
    	"data": {
    		"data": [
    			null,
    			3160.12890625,
    			3138.87255859375,
    			3139.27734375,
    			3139.30908203125,
    			3138.96533203125,
    			3138.2734375,
    			3137.31884765625,
    			3136.285400390625,
    			3135.2890625
            ],
    		"dimensions": [
    			401,
    			510
    		]
    	}
    }
    ```

1. Run the following curl command to get all the source objects for a particular object type guid.
    ```bash
    curl --request GET \
      --url https://<adme_url>/api/reservoir-ddms/v2/dataspaces/<dataspace-name>/resources/<data-object-type>/<data-object-type-guid>/sources \
      --header 'Authorization: Bearer <access-token>' \
      --header 'data-partition-id: <data-partition-id>'
    ```
    **Sample Request**
    
    Consider an Azure Data Manager for Energy resource named `admetest` with a data partition named `dp1` and data space name is `demo/Volve`. You want to get all the other objects a particular object with guid `07cb9ebb-299f-469b-9792-e76633a72b89` is referencing.
    ```bash
    curl --request GET \
      --url https://admetest.energy.azure.com/api/reservoir-ddms/v2/dataspaces/demo%2FVolve/resources/resqml20.obj_Grid2dRepresentation/07cb9ebb-299f-469b-9792-e76633a72b89/sources \
      --header 'Authorization: Bearer ey........' \
      --header 'data-partition-id: dp1'
    ```
    **Sample Response**
    ```json
    [
    	{
    		"uri": "eml:///dataspace('demo/Volve')/resqml20.obj_ContinuousProperty(c88bd325-59ba-4c5b-8b4c-d3b1d98be7c5)",
    		"alternateUris": [],
    		"name": "SnS_data_mismatch",
    		"lastChanged": "2019-01-03T17:11:20.000Z",
    		"storeLastWrite": "2025-02-05T11:33:11.766Z",
    		"storeCreated": "2025-02-05T11:33:11.766Z",
    		"activeStatus": "Active",
    		"customData": {
    			"created": "2019-01-03T17:11:20.000Z",
    			"creator": "ATsoblefack"
    		}
    	},
    	{
    		"uri": "eml:///dataspace('demo/Volve')/resqml20.obj_SubRepresentation(2756ba3c-ece5-498b-9633-6b7ed279043a)",
    		"alternateUris": [],
    		"name": "SnS_faults_proximity",
    		"lastChanged": "2019-01-03T17:11:20.000Z",
    		"storeLastWrite": "2025-02-05T11:33:11.766Z",
    		"storeCreated": "2025-02-05T11:33:11.766Z",
    		"activeStatus": "Active",
    		"customData": {
    			"created": "2019-01-03T17:11:20.000Z",
    			"creator": "ATsoblefack"
    		}
    	}
    ]
    ```

1. Run the following curl command to get targets objects for a particular object type guid.
    ```bash
    curl --request GET \
      --url https://<adme_url>/api/reservoir-ddms/v2/dataspaces/<dataspace-name>/resources/<data-object-type>/<data-object-type-guid>/targets \
      --header 'Authorization: Bearer <access-token>' \
      --header 'data-partition-id: <data-partition-id>'
    ```
    **Sample Request**
    
    Consider an Azure Data Manager for Energy resource named `admetest` with a data partition named `dp1` and data space name is `demo/Volve`. You want to get all the other objects that are referencing a particular object with guid `07cb9ebb-299f-469b-9792-e76633a72b89`.
    ```bash
    curl --request GET \
      --url https://admetest.energy.azure.com/api/reservoir-ddms/v2/dataspaces/demo%2FVolve/resources/resqml20.obj_Grid2dRepresentation/07cb9ebb-299f-469b-9792-e76633a72b89/targets \
      --header 'Authorization: Bearer ey........' \
      --header 'data-partition-id: dp1'
    ```
    **Sample Response**
    ```json
    [
    	{
    		"uri": "eml:///dataspace('demo/Volve')/resqml20.obj_ContinuousProperty(c88bd325-59ba-4c5b-8b4c-d3b1d98be7c5)",
    		"alternateUris": [],
    		"name": "SnS_data_mismatch",
    		"lastChanged": "2019-01-03T17:11:20.000Z",
    		"storeLastWrite": "2025-02-05T11:33:11.766Z",
    		"storeCreated": "2025-02-05T11:33:11.766Z",
    		"activeStatus": "Active",
    		"customData": {
    			"created": "2019-01-03T17:11:20.000Z",
    			"creator": "ATsoblefack"
    		}
    	},
    	{
    		"uri": "eml:///dataspace('demo/Volve')/resqml20.obj_SubRepresentation(2756ba3c-ece5-498b-9633-6b7ed279043a)",
    		"alternateUris": [],
    		"name": "SnS_faults_proximity",
    		"lastChanged": "2019-01-03T17:11:20.000Z",
    		"storeLastWrite": "2025-02-05T11:33:11.766Z",
    		"storeCreated": "2025-02-05T11:33:11.766Z",
    		"activeStatus": "Active",
    		"customData": {
    			"created": "2019-01-03T17:11:20.000Z",
    			"creator": "ATsoblefack"
    		}
    	}
    ]
    ```

## Related content
[Tutorial: Use Reservoir DDMS websocket API endpoints](tutorial-reservoir-ddms-websocket.md)