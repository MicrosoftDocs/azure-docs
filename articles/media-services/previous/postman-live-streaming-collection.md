---
title: Import the Postman collection for Azure Live Streaming REST calls 
description: This article provides a definition of the Postman collection for Azure Media Services REST calls.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/20/2019
ms.author: juliako

---

# Import a Postman collection with Live Streaming operations 

This article contains a definition of the **Postman** collection that contains grouped HTTP requests that call **Live Streaming** Azure Media Services REST APIs. For information about how to configure **Postman** so it can be used to call Media Services REST APIs, see [Configure Postman for Media Services REST API calls](media-rest-apis-with-postman.md) tutorial.

```
{
	"info": {
		"name": "Azure Media Live Streaming Quickstart",
		"_postman_id": "0dc5e4c6-4865-cbe9-250c-78e40b634256",
		"description": "Quickstart collection to use Live Streaming and Encding on Azure Media Services\n",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "1. Get AAD Auth Token copy",
			"description": "To get started making calls to Azure Media Services you have to first do the following:\n1) Get Token and cache it.\n2) Get the Closest API endpoint from http://media.windows.net",
			"item": [
				{
					"name": "Get Azure AD Token for Auth (Expires every Hour!)",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"var json = JSON.parse(responseBody);",
									"postman.setEnvironmentVariable(\"AccessToken\", json.access_token);"
								]
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/x-www-form-urlencoded"
							},
							{
								"key": "Keep-Alive",
								"value": "true"
							}
						],
						"body": {
							"mode": "urlencoded",
							"urlencoded": [
								{
									"key": "grant_type",
									"value": "client_credentials",
									"description": "",
									"type": "text"
								},
								{
									"key": "client_id",
									"value": "{{ClientId}}",
									"description": "The Client ID for your AAD application",
									"type": "text"
								},
								{
									"key": "client_secret",
									"value": "{{ClientSecret}}",
									"description": "The Client Secret for your AAD application Service principal",
									"type": "text"
								},
								{
									"key": "resource",
									"value": "https://rest.media.azure.net",
									"description": "Normally this is https://rest.media.azure.net",
									"type": "text"
								}
							]
						},
						"url": {
							"raw": "https://login.microsoftonline.com/{{TenantId}}/oauth2/token",
							"protocol": "https",
							"host": [
								"login",
								"microsoftonline",
								"com"
							],
							"path": [
								"{{TenantId}}",
								"oauth2",
								"token"
							]
						},
						"description": ""
					},
					"response": []
				}
			]
		},
		{
			"name": "2. Create Channel",
			"description": "",
			"item": [
				{
					"name": "2.1 - Create Channel (New Encoder)",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "7ac7d788-f35e-420b-aca3-ffabc5d65ae6",
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 202\"] = responseCode.code === 202;",
									"",
									"",
									"pm.test(\"Check for Id and store\", function () {",
									"    var jsonData = pm.response.json();",
									"    pm.expect(jsonData.Id.Value)",
									"    ",
									"    pm.environment.set(\"ChannelId\", jsonData.Id );",
									"",
									"});",
									"",
									"var jsonData = pm.response.json();",
									"tests[\"Has State\"] = jsonData.State !== null;",
									"tests[\"Has Encoding\"] = jsonData.EncodingType == \"Standard\";",
									"",
									""
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"Name\": \"MyPostmanChannel\",\r\n    \"Description\": \"My Live Encoding channel from Postman\",\r\n    \"EncodingType\": \"Standard\",\r\n    \"Encoding\": null,\r\n    \"Slate\": null,\r\n    \"Input\": {\r\n        \"KeyFrameInterval\": null,\r\n        \"StreamingProtocol\": \"RTMP\",\r\n        \"AccessControl\": {\r\n            \"IP\": {\r\n                \"Allow\": [\r\n                    {\r\n                        \"Name\": \"Allow All\",\r\n                        \"Address\": \"0.0.0.0\",\r\n                        \"SubnetPrefixLength\": 0\r\n                    }\r\n                ]\r\n            }\r\n        },\r\n        \"Endpoints\": []\r\n    },\r\n    \"Preview\": {\r\n        \"AccessControl\": {\r\n            \"IP\": {\r\n                \"Allow\": [\r\n                    {\r\n                        \"Name\": \"Allow All\",\r\n                        \"Address\": \"0.0.0.0\",\r\n                        \"SubnetPrefixLength\": 0\r\n                    }\r\n                ]\r\n            }\r\n        },\r\n        \"Endpoints\": []\r\n    },\r\n    \"Output\": {\r\n        \"Hls\": {\r\n            \"FragmentsPerSegment\": \"1\"\r\n        }\r\n    },\r\n    \"CrossSiteAccessPolicies\": {\r\n        \"ClientAccessPolicy\": null,\r\n        \"CrossDomainPolicy\": null\r\n    }\r\n}\r\n"
						},
						"url": {
							"raw": "{{ApiEndpoint}}/Channels",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Channels"
							]
						},
						"description": "Create Channel with Encoding\n\nChannels can be created using a POST HTTP request and specifying property values.\n\nIf successful, a 202 Accepted status code is returned along with a representation of the created entity in the response body. \n\nThe 202 Accepted status code indicates an asynchronous operation, in which case the operation-id header value is also provided for use in polling and tracking the status of long-running operations, such as starting or stopping a Channel. Pass the operation-id header value into the Operation Entity to retrieve the status. For more information, see Manually Polling Long-Running Operations.\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "2.2 - Get Channel (to check that it is good!)",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "447b6b3e-6c43-437e-80ba-048bb1b55dc0",
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;",
									"tests[\"Channel has an ID\"] = jsonData.Id !== null;",
									"",
									"tests[\"Channel has an IngestUrl\"] = jsonData.Input.Endpoints[0].Url!== null;",
									"pm.environment.set(\"IngestUrl\", jsonData.Input.Endpoints[0].Url);",
									"",
									"pm.environment.set(\"variable_key\", \"variable_value\");"
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.15"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {},
						"url": {
							"raw": "{{ApiEndpoint}}/Channels('{{ChannelId}}')",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Channels('{{ChannelId}}')"
							]
						},
						"description": "List Channels\n\nThe Channel entity represents a pipeline for processing live streaming content.\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "2.3 - Start the Channel",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "ab712ce8-5023-4fa4-b0f8-90fa5ad7d56a",
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 202- Means it started!\"] = responseCode.code === 202;",
									""
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {},
						"url": {
							"raw": "{{ApiEndpoint}}/Channels('{{ChannelId}}')/Start",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Channels('{{ChannelId}}')",
								"Start"
							]
						},
						"description": "Start a Channel\n\nThe Channel entity represents a pipeline for processing live streaming content.\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "2.4 - Poll Channel to see if it started (State == \"Started\")",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "6f2a03fc-dae1-4582-9a7a-690c4d4386f0",
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Channel has value\"] = jsonData.value !== null;",
									"tests[\"Channel is Running\"] = jsonData.value == \"Running\";",
									""
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.15"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {},
						"url": {
							"raw": "{{ApiEndpoint}}/Channels('{{ChannelId}}')/State",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Channels('{{ChannelId}}')",
								"State"
							]
						},
						"description": "List Channels\n\nThe Channel entity represents a pipeline for processing live streaming content.\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				}
			],
			"event": [
				{
					"listen": "prerequest",
					"script": {
						"id": "66894a1f-eb6e-4755-925d-4e0c9715efcc",
						"type": "text/javascript",
						"exec": [
							""
						]
					}
				},
				{
					"listen": "test",
					"script": {
						"id": "01313c76-73d2-4218-a42f-594f8b2740b8",
						"type": "text/javascript",
						"exec": [
							""
						]
					}
				}
			]
		},
		{
			"name": "3. Create a Program (Recording)",
			"description": "",
			"item": [
				{
					"name": "3.1 - Create Asset for the Program to Record to",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "2870b32d-e412-4783-b4fe-74d0a2e6ca66",
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 201\"] = responseCode.code === 201;",
									"",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has an ID\"] = jsonData.Id !== null;",
									"tests[\"Has Created date\"] = jsonData.Created !== null;",
									"tests[\"has a URI\"] = jsonData.Uri !== null;",
									"",
									"",
									"pm.environment.set(\"AssetId\", jsonData.Id);",
									"",
									""
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    Name:\"Asset for Recording\",\n    Options:0\n}"
						},
						"url": {
							"raw": "{{ApiEndpoint}}/Assets",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Assets"
							]
						},
						"description": "Create Assets\nThe Asset entity contains digital files (including video, audio, images, thumbnail collections, text tracks and closed caption files) and the metadata about these files. After the digital files are uploaded into an asset, they could be used in the Media Services encoding and streaming workflows.\n\n[Asset Entity REST API](https://msdn.microsoft.com/library/azure/hh974277.aspx)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "3.2 -  Create Program",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "f8ee90d1-5fad-448c-9686-4394ed5b094c",
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Id\"] = jsonData.Id !== null;",
									"tests[\"Has State\"] = jsonData.State !== null;",
									"",
									"",
									"pm.environment.set(\"ProgramId\", jsonData.Id);"
								]
							}
						},
						{
							"listen": "prerequest",
							"script": {
								"id": "c87a3cf5-d004-4512-acb0-1878f5d7375f",
								"type": "text/javascript",
								"exec": [
									""
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n\t\"Name\":\"testprogram004\",\n\t\"Description\":\"\",\n\t\"ChannelId\" : \"{{ChannelId}}\",\n\t\"AssetId\": \"{{AssetId}}\",\n\t\"ArchiveWindowLength\":\"PT1H\"\n}"
						},
						"url": {
							"raw": "{{ApiEndpoint}}/Programs",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Programs"
							]
						},
						"description": "Create Program\n\n[Create Programs documentation](https://docs.microsoft.com/rest/api/media/operations/program#create_programs)\n\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "3.3 - Create AccessPolicy for Streaming",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "8a646a73-f26d-4493-a101-5c270f5b68de",
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 201\"] = responseCode.code === 201;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Id\"] = jsonData.Id !== null;",
									"",
									"",
									"pm.environment.set(\"AccessPolicyId\", jsonData.Id);"
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n\t\"Name\": \"StreamingAccessPolicy-test001\", \n\t\"DurationInMinutes\" : \"525600\", \n\t\"Permissions\" : 1 \n}  "
						},
						"url": {
							"raw": "{{ApiEndpoint}}/AccessPolicies",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"AccessPolicies"
							]
						},
						"description": "https://docs.microsoft.com/rest/api/media/operations/accesspolicy#create_an_accesspolicy\n\n\n## Permissions: \nspecifies the access rights the client has when interacting with the Asset. Valid values are:\n\n- None = 0 (default)\n- Read = 1\n- Write = 2\n- Delete = 4\n- List = 8"
					},
					"response": []
				},
				{
					"name": "3.3 - Start the Program",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "d626a1a9-b51f-4343-97ea-d981ba45041d",
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 202\"] = responseCode.code === 202;",
									""
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {},
						"url": {
							"raw": "{{ApiEndpoint}}/Programs('{{ProgramId}}')/Start",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Programs('{{ProgramId}}')",
								"Start"
							]
						},
						"description": "Start Programs\n\n[Start a Program documentation](https://docs.microsoft.com/rest/api/media/operations/program#start_programs)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "3.4 - Create Streaming URL (Locator)",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n\t\"AccessPolicyId\": \"{{AccessPolicyId}}\", \n\t\"AssetId\" : \"{{AssetId}}\", \n\t\"StartTime\" : \"2018-02-09T17:55\", \n\t\"Type\":2\n}  "
						},
						"url": {
							"raw": "{{ApiEndpoint}}/Locators",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Locators"
							]
						},
						"description": "https://docs.microsoft.com/rest/api/media/operations/locator#list_locators"
					},
					"response": []
				},
				{
					"name": "3.5 - Stop the Program",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "9810e24f-4bc4-4048-a70f-9c5a9fba5bf7",
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 202\"] = responseCode.code === 202;",
									"",
									""
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {},
						"url": {
							"raw": "{{ApiEndpoint}}/Programs('{{ProgramId}}')/Stop",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Programs('{{ProgramId}}')",
								"Stop"
							]
						},
						"description": "Strop Programs\n\n[Stop a Program documentation](https://docs.microsoft.com/rest/api/media/operations/program#stop_programs)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				}
			]
		},
		{
			"name": "4 - Operate Live Stream",
			"description": "",
			"item": [
				{
					"name": "Reset Channel",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 202\"] = responseCode.code === 202;",
									""
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {},
						"url": {
							"raw": "{{ApiEndpoint}}/Channels('{{ChannelId}}')/Reset",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Channels('{{ChannelId}}')",
								"Reset"
							]
						},
						"description": "Reset a Channel\n\nThe Channel entity represents a pipeline for processing live streaming content.\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Start Advertisement",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 202\"] = responseCode.code === 202;",
									""
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\r\n   \"duration\":\"PT45S\",\r\n   \"cueId\":\"67520935\",\r\n   \"showSlate\":\"true\"\r\n}\r\n"
						},
						"url": {
							"raw": "{{ApiEndpoint}}/Channels('{{ChannelId}}')/StartAdvertisement",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Channels('{{ChannelId}}')",
								"StartAdvertisement"
							]
						},
						"description": "Start a Channel Ad Break\n\nThe live encoder can be signaled to start an advertisement or commercial break using a POST HTTP request and specifying property values of the in the StartAdvertisement Entity entity in the body of the request.\n\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "End Advertisement",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 202\"] = responseCode.code === 202;",
									""
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {
							"mode": "raw",
							"raw": ""
						},
						"url": {
							"raw": "{{ApiEndpoint}}/Channels('{{ChannelId}}')/EndAdvertisement",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Channels('{{ChannelId}}')",
								"EndAdvertisement"
							]
						},
						"description": "End a Channel Ad Break\n\nThe live encoder can be signaled to start an advertisement or commercial break using a POST HTTP request and specifying property values of the in the StartAdvertisement Entity entity in the body of the request.\n\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Show Slate (use Default)",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 202\"] = responseCode.code === 202;",
									""
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {
							"mode": "raw",
							"raw": ""
						},
						"url": {
							"raw": "{{ApiEndpoint}}/Channels('{{ChannelId}}')/ShowSlate",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Channels('{{ChannelId}}')",
								"ShowSlate"
							]
						},
						"description": "Show Slate\n\nIndicates to the live encoder within the Channel that it needs to switch to the default slate image during the commercial break (and mask the incoming video feed). Default is false. The image used will be the one specified via the default slate asset Id property at the time of the channel creation. \n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Show Slate (use Asset ID) ",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 202\"] = responseCode.code === 202;",
									""
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\r\n   \"duration\":\"PT45S\",\r\n   \"assetId\":\"nb:cid:UUID:01234567-ABCD-ABCD-EFEF-01234567\"\r\n}"
						},
						"url": {
							"raw": "{{ApiEndpoint}}/Channels('{{ChannelId}}')/ShowSlate",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Channels('{{ChannelId}}')",
								"ShowSlate"
							]
						},
						"description": "Show Slate\n\nIndicates to the live encoder within the Channel that it needs to switch to the default slate image during the commercial break (and mask the incoming video feed). Default is false. The image used will be the one specified via the default slate asset Id property at the time of the channel creation. \n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Hide Slate",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 202\"] = responseCode.code === 202;",
									""
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {
							"mode": "raw",
							"raw": ""
						},
						"url": {
							"raw": "{{ApiEndpoint}}/Channels('{{ChannelId}}')/HideSlate",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Channels('{{ChannelId}}')",
								"HideSlate"
							]
						},
						"description": "Hide Slate\n\nThe live encoder can be signaled to end an on-going slate using a POST HTTP request.\n\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Stop Channel",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 202\"] = responseCode.code === 202;",
									""
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {},
						"url": {
							"raw": "{{ApiEndpoint}}/Channels('nb:chid:UUID:27ff0843-abae-4261-b46e-0558efc21f82')/Stop",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Channels('nb:chid:UUID:27ff0843-abae-4261-b46e-0558efc21f82')",
								"Stop"
							]
						},
						"description": "Stop a Channel\n\nThe Channel entity represents a pipeline for processing live streaming content.\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Delete Channel",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "aba1c50b-39da-46f4-aa73-9b8ec84cd068",
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 202\"] = responseCode.code === 202;",
									"",
									""
								]
							}
						}
					],
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{AccessToken}}",
									"type": "string"
								}
							]
						},
						"method": "DELETE",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.19"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {},
						"url": {
							"raw": "{{ApiEndpoint}}/Channels('{{ChannelId}}')",
							"host": [
								"{{ApiEndpoint}}"
							],
							"path": [
								"Channels('{{ChannelId}}')"
							]
						},
						"description": "Delete Channels\n\nDelete the Channel entity\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				}
			]
		}
	],
	"auth": {
		"type": "bearer",
		"bearer": [
			{
				"key": "token",
				"value": "{{AccessToken}}",
				"type": "string"
			}
		]
	},
	"variable": [
		{
			"id": "f73392be-121b-418c-8489-8530323768b0",
			"key": "channelName",
			"value": "User001",
			"type": "text"
		},
		{
			"id": "ec9ba052-77ba-47e2-93c2-5aaed691c012",
			"key": "channelID",
			"value": "",
			"type": "text"
		},
		{
			"id": "0611b82b-6c00-498b-89ee-2b97f2a4dcd7",
			"key": "programName",
			"value": "User001Program",
			"type": "text"
		},
		{
			"id": "fdc71bce-8477-473b-aa89-eda66a61b776",
			"key": "programId",
			"value": "",
			"type": "text"
		}
	]
}
```
