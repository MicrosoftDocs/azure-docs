---
title: Import the Postman collection with Azure On-Demand Streaming operations
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

# Import a Postman collection with On-Demand Streaming operations 

This article contains a definition of the **Postman** collection that contains grouped HTTP requests that call Azure Media Services REST APIs. For information about how to configure **Postman** so it can be used to call Media Services REST APIs, see [Configure Postman for Media Services REST API calls](media-rest-apis-with-postman.md) tutorial.

```json
{
	"info": {
		"name": "Azure Media Services Operations",
		"_postman_id": "3a9a704f-ec11-3433-a0dc-54e4fe39e9d8",
		"description": "Azure Media Service REST API v 2.0 Collection\n\nSupports AD service principal authentication\nFor details see:https://docs.microsoft.com/azure/media-services/media-services-rest-connect-with-aad\n\n",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "1. Get AAD Auth Token",
			"description": "To get started making calls to Azure Media Services you have to first do the following:\n1) Get Token and cache it.\n2) Get the Closest API endpoint from http://media.windows.net",
			"item": [
				{
					"name": "Get Azure AD Token for Service Principal Authentication",
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
									"value": "{{ClientID}}",
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
							"raw": "{{AzureADSTSEndpoint}}",
							"host": [
								"{{AzureADSTSEndpoint}}"
							]
						},
						"description": ""
					},
					"response": []
				}
			]
		},
		{
			"name": "AccessPolicy",
			"description": "https://docs.microsoft.com/rest/api/media/operations/accesspolicy\n\nAn AccessPolicy defines the permissions and duration of storage SAS or streaming access to an Asset.",
			"item": [
				{
					"name": "Create AccessPolicy for ReadOnly",
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
						"body": {
							"mode": "raw",
							"raw": "{\n\t\"Name\": \"NewUploadPolicy\", \n\t\"DurationInMinutes\" : \"100\", \n\t\"Permissions\" : 1 \n}  "
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/AccessPolicies",
							"host": [
								"{{RESTAPIEndpoint}}"
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
					"name": "Create AccessPolicy for Upload (Write)",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"var json = JSON.parse(responseBody);",
									"postman.setEnvironmentVariable(\"LastAccessPolicyId\", json.Id);"
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
						"body": {
							"mode": "raw",
							"raw": "{\n\t\"Name\": \"NewUploadPolicy\", \n\t\"DurationInMinutes\" : \"100\", \n\t\"Permissions\" : 2 \n}  "
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/AccessPolicies",
							"host": [
								"{{RESTAPIEndpoint}}"
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
					"name": "List AccessPolicies",
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
							"raw": "{{RESTAPIEndpoint}}/AccessPolicies",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"AccessPolicies"
							]
						},
						"description": "https://docs.microsoft.com/rest/api/media/operations/accesspolicy#list_accesspolicies"
					},
					"response": []
				},
				{
					"name": "Delete AccessPolicy",
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
							"raw": "{{RESTAPIEndpoint}}/AccessPolicies{'{{accessPolicyId}}')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"AccessPolicies{'{{accessPolicyId}}')"
							]
						},
						"description": "https://docs.microsoft.com/rest/api/media/operations/accesspolicy#list_accesspolicies"
					},
					"response": []
				}
			]
		},
		{
			"name": "Assets",
			"description": "",
			"item": [
				{
					"name": "Get Assets",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Assets",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Assets"
							]
						},
						"description": "List Assets\nThe Asset entity contains digital files (including video, audio, images, thumbnail collections, text tracks and closed caption files) and the metadata about these files. After the digital files are uploaded into an asset, they could be used in the Media Services encoding and streaming workflows.\n\nAsset Entity REST API - https://msdn.microsoft.com/library/azure/hh974277.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Get Specific Asset ID",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Assets('{{LastAssetId}}')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Assets('{{LastAssetId}}')"
							]
						},
						"description": ""
					},
					"response": []
				},
				{
					"name": "List Locators on a Specific Asset",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Assets('{{LastAssetId}}')/Locators",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Assets('{{LastAssetId}}')",
								"Locators"
							]
						},
						"description": "https://docs.microsoft.com/rest/api/media/operations/locator#list_locators\n"
					},
					"response": []
				},
				{
					"name": "Get Assets ($top)",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Assets?$top=1",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Assets"
							],
							"query": [
								{
									"key": "$top",
									"value": "1",
									"equals": true
								}
							]
						},
						"description": "List Assets $top = value"
					},
					"response": []
				},
				{
					"name": "Get Assets ($skip)",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Assets?$skip=1",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Assets"
							],
							"query": [
								{
									"key": "$skip",
									"value": "1",
									"equals": true
								}
							]
						},
						"description": "List Assets"
					},
					"response": []
				},
				{
					"name": "Get Assets ($inlinecount=allpages)",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;",
									"tests[\"Has count\"] = jsonData.odata_count !== null;"
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
								"key": "DataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "MaxDataServiceVersion",
								"value": "3.0"
							},
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "User-Agent",
								"value": "azure media services postman collection"
							}
						],
						"body": {},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Assets?$inlinecount=allpages",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Assets"
							],
							"query": [
								{
									"key": "$inlinecount",
									"value": "allpages",
									"equals": true
								}
							]
						},
						"description": "List Assets with page count"
					},
					"response": []
				},
				{
					"name": "Create Asset",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"var json = JSON.parse(responseBody);",
									"postman.setEnvironmentVariable(\"LastAssetId\", json.Id);"
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
						"body": {
							"mode": "raw",
							"raw": "{\n\t\"Name\": \"Hello from Postman\" \n}  "
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Assets",
							"host": [
								"{{RESTAPIEndpoint}}"
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
					"name": "Delete Asset",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 204 No Content\"] = responseCode.code === 204;",
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
						"body": {
							"mode": "raw",
							"raw": ""
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Assets('{{LastAssetId}}')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Assets('{{LastAssetId}}')"
							]
						},
						"description": "Create Assets\nThe Asset entity contains digital files (including video, audio, images, thumbnail collections, text tracks and closed caption files) and the metadata about these files. After the digital files are uploaded into an asset, they could be used in the Media Services encoding and streaming workflows.\n\nUse the global variable from the CreateAsset Post to delete the asset. It is stored in the LastAssetId global variable.\n\nAsset Entity REST API - https://msdn.microsoft.com/library/azure/hh974277.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Update Asset copy",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 204\"] = responseCode.code === 204;",
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
						"method": "PATCH",
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
						"body": {
							"mode": "raw",
							"raw": "{\n    Name:\"Hello - this is my new name\"\n}"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Assets('{{LastAssetId}}')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Assets('{{LastAssetId}}')"
							]
						},
						"description": "Update Assets\nThe Asset entity contains digital files (including video, audio, images, thumbnail collections, text tracks and closed caption files) and the metadata about these files. After the digital files are uploaded into an asset, they could be used in the Media Services encoding and streaming workflows.\n\nAsset Entity REST API - https://msdn.microsoft.com/library/azure/hh974277.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Get Assets ($filter=startswith)",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Assets?$top=20&$filter=startswith(Name,'Holo')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Assets"
							],
							"query": [
								{
									"key": "$top",
									"value": "20",
									"equals": true
								},
								{
									"key": "$filter",
									"value": "startswith(Name,'Holo')",
									"equals": true
								}
							]
						},
						"description": "List Assets and filter by startswith"
					},
					"response": []
				},
				{
					"name": "Get Assets ($filter) indexof",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Assets?$top=20&$filter=indexof(Name,'Holo') gt 1",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Assets"
							],
							"query": [
								{
									"key": "$top",
									"value": "20",
									"equals": true
								},
								{
									"key": "$filter",
									"value": "indexof(Name,'Holo') gt 1",
									"equals": true
								}
							]
						},
						"description": "List Assets $filter and indexof"
					},
					"response": []
				}
			]
		},
		{
			"name": "AssetFiles",
			"description": "",
			"item": [
				{
					"name": "CreateFileInfos",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 204 No Content\"] = responseCode.code === 204;",
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
							"raw": "{{RESTAPIEndpoint}}/CreateFileInfos?assetid='{{LastAssetId}}'",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"CreateFileInfos"
							],
							"query": [
								{
									"key": "assetid",
									"value": "'{{LastAssetId}}'",
									"equals": true
								}
							]
						},
						"description": "Create Asset Files\nTo create the asset files on an asset, you have to use the CreateFileInfos function.\nA File entity is created using the CreateFileInfos function and passing in the Asset Id that is associated with the media file you uploaded into blob storage. For more information, see Upload a file to blob storage.\nhttps://msdn.microsoft.com/library/azure/jj683097.aspx\n\nAssetFile Entity REST API \nhttps://msdn.microsoft.com/library/azure/hh974275.aspx \n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Get Asset Files",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Response has a value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Assets('{{LastAssetId}}')/Files",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Assets('{{LastAssetId}}')",
								"Files"
							]
						},
						"description": "Get Asset Files\n\nAssetFile Entity REST API \nhttps://msdn.microsoft.com/library/azure/hh974275.aspx \n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Update Asset File",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 204 No Content\"] = responseCode.code === 204;",
									""
								]
							}
						}
					],
					"request": {
						"method": "PATCH",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.15"
							},
							{
								"key": "Authorization",
								"value": "Bearer {{AccessToken}}"
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
							"raw": "{\n    MimeType: \"video/mp4\"\n}"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Files('nb:cid:UUID:5710445d-1500-80c4-bc75-f1e5c3a6141b')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Files('nb:cid:UUID:5710445d-1500-80c4-bc75-f1e5c3a6141b')"
							]
						},
						"description": "Update an Asset Files\n\nAssetFile Entity REST API \nhttps://msdn.microsoft.com/library/azure/hh974275.aspx \n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				}
			]
		},
		{
			"name": "Channels",
			"description": "",
			"item": [
				{
					"name": "Get Channels ",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Channels",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Channels"
							]
						},
						"description": "List Channels\n\nThe Channel entity represents a pipeline for processing live streaming content.\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Create Channel (Pass-Through)",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 202\"] = responseCode.code === 202;",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"postman.setEnvironmentVariable(\"LastChannelId\", jsonData.Id);"
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
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"Name\": \"postman-test-channel-1\",\r\n    \"Description\": \"My channel description for use in discovery\",\r\n    \"Input\": {\r\n        \"KeyFrameInterval\": null,\r\n        \"StreamingProtocol\": \"FragmentedMP4\",\r\n        \"AccessControl\": {\r\n            \"IP\": {\r\n                \"Allow\": [\r\n          {\r\n                        \"Name\": \"Allow All\",\r\n                        \"Address\": \"0.0.0.0\",\r\n                        \"SubnetPrefixLength\": 0\r\n                    }\r\n                ]\r\n            }\r\n        },\r\n        \"Endpoints\": []\r\n    },\r\n    \"Preview\": {\r\n        \"AccessControl\": {\r\n            \"IP\": {\r\n                \"Allow\": [\r\n          {\r\n                        \"Name\": \"Allow All\",\r\n                        \"Address\": \"0.0.0.0\",\r\n                        \"SubnetPrefixLength\": 0\r\n                    }\r\n                ]\r\n            }\r\n        },\r\n        \"Endpoints\": []\r\n    },\r\n    \"Output\": {\r\n        \"Hls\": {\r\n            \"FragmentsPerSegment\": 1\r\n        }\r\n    },\r\n    \"CrossSiteAccessPolicies\": {\r\n        \"ClientAccessPolicy\": null,\r\n        \"CrossDomainPolicy\": null\r\n    }\r\n}"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Channels",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Channels"
							]
						},
						"description": "Create Channel\n\nChannels can be created using a POST HTTP request and specifying property values.\n\nIf successful, a 202 Accepted status code is returned along with a representation of the created entity in the response body. \n\nThe 202 Accepted status code indicates an asynchronous operation, in which case the operation-id header value is also provided for use in polling and tracking the status of long-running operations, such as starting or stopping a Channel. Pass the operation-id header value into the Operation Entity to retrieve the status. For more information, see Manually Polling Long-Running Operations.\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Create Channel (Encoding old)",
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
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"Name\": \"postman-encoding-channel\",\r\n    \"Description\": \"My description of my channel for discovery\",\r\n    \"EncodingType\": \"Standard\",\r\n    \"Encoding\": {\r\n        \"SystemPreset\": \"Default720p\",\r\n        \"IgnoreCea708ClosedCaptions\": false,\r\n        \"AdMarkerSource\": \"Api\",\r\n        \"VideoStream\": {\r\n            \"Index\": 1,\r\n            \"Name\": \"Video stream\"\r\n        },\r\n        \"AudioStreams\": [\r\n            {\r\n                \"Index\": 0,\r\n                \"Name\": \"English audio stream\",\r\n                \"Language\": \"ENG\"\r\n            }\r\n        ]\r\n    },\r\n    \"Input\": {\r\n        \"KeyFrameInterval\": null,\r\n        \"StreamingProtocol\": \"FragmentedMP4\",\r\n        \"AccessControl\": {\r\n            \"IP\": {\r\n                \"Allow\": [\r\n                    {\r\n                        \"Name\": \"testName1\",\r\n                        \"Address\": \"1.1.1.1\",\r\n                        \"SubnetPrefixLength\": 24\r\n                    }\r\n                ]\r\n            }\r\n        },\r\n        \"Endpoints\": []\r\n    },\r\n    \"Preview\": {\r\n        \"AccessControl\": {\r\n            \"IP\": {\r\n                \"Allow\": [\r\n                    {\r\n                        \"Name\": \"testName1\",\r\n                        \"Address\": \"1.1.1.1\",\r\n                        \"SubnetPrefixLength\": 24\r\n                    }\r\n                ]\r\n            }\r\n        },\r\n        \"Endpoints\": []\r\n    },\r\n    \"Output\": {\r\n        \"Hls\": {\r\n            \"FragmentsPerSegment\": 1\r\n        }\r\n    }\r\n}"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Channels",
							"host": [
								"{{RESTAPIEndpoint}}"
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
					"name": "Create Channel (New Encoder)",
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
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"Name\": \"CoolNewEncoderChannel\",\r\n    \"Description\": \"My description of my channel\",\r\n    \"EncodingType\": \"Basic\",\r\n    \"Encoding\": null,\r\n    \"Slate\": null,\r\n    \"Input\": {\r\n        \"KeyFrameInterval\": null,\r\n        \"StreamingProtocol\": \"RTMP\",\r\n        \"AccessControl\": {\r\n            \"IP\": {\r\n                \"Allow\": [\r\n                    {\r\n                        \"Name\": \"testName1\",\r\n                        \"Address\": \"1.1.1.1\",\r\n                        \"SubnetPrefixLength\": 24\r\n                    }\r\n                ]\r\n            }\r\n        },\r\n        \"Endpoints\": []\r\n    },\r\n    \"Preview\": {\r\n        \"AccessControl\": {\r\n            \"IP\": {\r\n                \"Allow\": [\r\n                    {\r\n                        \"Name\": \"testName1\",\r\n                        \"Address\": \"1.1.1.1\",\r\n                        \"SubnetPrefixLength\": 24\r\n                    }\r\n                ]\r\n            }\r\n        },\r\n        \"Endpoints\": []\r\n    },\r\n    \"Output\": {\r\n        \"Hls\": {\r\n            \"FragmentsPerSegment\": null\r\n        }\r\n    },\r\n    \"CrossSiteAccessPolicies\": {\r\n        \"ClientAccessPolicy\": null,\r\n        \"CrossDomainPolicy\": null\r\n    }\r\n}\r\n"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Channels",
							"host": [
								"{{RESTAPIEndpoint}}"
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
					"name": "Delete Channel",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Channels('nb:chid:UUID:27ff0843-abae-4261-b46e-0558efc21f82')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Channels('nb:chid:UUID:27ff0843-abae-4261-b46e-0558efc21f82')"
							]
						},
						"description": "Delete Channels\n\nDelete the Channel entity\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Start Channel",
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
							"raw": "{{RESTAPIEndpoint}}/Channels('nb:chid:UUID:27ff0843-abae-4261-b46e-0558efc21f82')/Start",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Channels('nb:chid:UUID:27ff0843-abae-4261-b46e-0558efc21f82')",
								"Start"
							]
						},
						"description": "Start a Channel\n\nThe Channel entity represents a pipeline for processing live streaming content.\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
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
							"raw": "{{RESTAPIEndpoint}}/Channels('nb:chid:UUID:27ff0843-abae-4261-b46e-0558efc21f82')/Stop",
							"host": [
								"{{RESTAPIEndpoint}}"
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
							"raw": "{{RESTAPIEndpoint}}/Channels('{{LastChannelId}}')/Reset",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Channels('{{LastChannelId}}')",
								"Reset"
							]
						},
						"description": "Reset a Channel\n\nThe Channel entity represents a pipeline for processing live streaming content.\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Update Channel",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 202\"] = responseCode.code === 202;",
									"",
									"postman.setEnvironmentVariable(\"LastChannelId\", jsonData.Id);"
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
						"method": "PATCH",
						"header": [
							{
								"key": "x-ms-version",
								"value": "2.15"
							},
							{
								"key": "Accept",
								"value": "application/json;odata=minimalmetadata"
							},
							{
								"key": "Content-Type",
								"value": "application/json;odata=minimalmetadata"
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
							"raw": "\"Encoding\":{\"IgnoreCea708ClosedCaptions\": true}"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Channels",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Channels"
							]
						},
						"description": "Update Channel\n\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
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
						"body": {
							"mode": "raw",
							"raw": "{\r\n   \"duration\":\"PT45S\",\r\n   \"cueId\":\"67520935\",\r\n   \"showSlate\":\"true\"\r\n}\r\n"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Channels('{{LastChannelId}}')/StartAdvertisement",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Channels('{{LastChannelId}}')",
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
						"body": {
							"mode": "raw",
							"raw": ""
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Channels('{{LastChannelId}}')/EndAdvertisement",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Channels('{{LastChannelId}}')",
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
						"body": {
							"mode": "raw",
							"raw": ""
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Channels('{{LastChannelId}}')/ShowSlate",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Channels('{{LastChannelId}}')",
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
						"body": {
							"mode": "raw",
							"raw": "{\r\n   \"duration\":\"PT45S\",\r\n   \"assetId\":\"nb:cid:UUID:01234567-ABCD-ABCD-EFEF-01234567\"\r\n}"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Channels('{{LastChannelId}}')/ShowSlate",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Channels('{{LastChannelId}}')",
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
						"body": {
							"mode": "raw",
							"raw": ""
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Channels('{{LastChannelId}}')/HideSlate",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Channels('{{LastChannelId}}')",
								"HideSlate"
							]
						},
						"description": "Hide Slate\n\nThe live encoder can be signaled to end an on-going slate using a POST HTTP request.\n\n\nChannel Entity REST API - https://msdn.microsoft.com/library/azure/dn783458.aspx\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				}
			]
		},
		{
			"name": "Filter",
			"description": "https://docs.microsoft.com/rest/api/media/operations/filter#filter_properties\n",
			"item": [
				{
					"name": "List Filters",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Filters",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Filters"
							]
						},
						"description": "List Filters\n\n[List Filters documentation](https://docs.microsoft.com/rest/api/media/operations/filter#list_filters)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Delete Filter",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Filters('{{filterId}}')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Filters('{{filterId}}')"
							]
						},
						"description": "Delete Filters\n\n[Delete Filters documentation](https://docs.microsoft.com/rest/api/media/operations/filter#delete_a_filter)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Create Filter",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
						"body": {
							"mode": "raw",
							"raw": "{  \r\n   \"Name\":\"Mobile\",  \r\n   \"PresentationTimeRange\":{    \r\n      \"StartTimestamp\":\"0\",  \r\n      \"EndTimestamp\":\"9223372036854775807\",  \r\n      \"PresentationWindowDuration\":\"12000000000\",  \r\n      \"LiveBackoffDuration\":\"0\",  \r\n      \"Timescale\":\"10000000\"  \r\n   },  \r\n   \"Tracks\":[    \r\n      {    \r\n         \"PropertyConditions\":[    \r\n            {    \r\n               \"Property\":\"Type\",  \r\n               \"Value\":\"video\",  \r\n               \"Operator\":\"Equal\"  \r\n            },  \r\n            {    \r\n               \"Property\":\"Bitrate\",  \r\n               \"Value\":\"550000-1350000\",  \r\n               \"Operator\":\"Equal\"  \r\n            }  \r\n         ]  \r\n      }  \r\n   ]  \r\n}  "
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Filters",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Filters"
							]
						},
						"description": "Create Filter\n\n[Create Filter documentation](https://docs.microsoft.com/rest/api/media/operations/filter#create_a_filter)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Update Filter",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
						"body": {
							"mode": "raw",
							"raw": "{  \r\n   \"Tracks\":[    \r\n      {    \r\n         \"PropertyConditions\":  \r\n         [    \r\n            {    \r\n               \"Property\":\"Type\",  \r\n               \"Value\":\"audio\",  \r\n               \"Operator\":\"Equal\"  \r\n            },  \r\n            {    \r\n               \"Property\":\"Bitrate\",  \r\n               \"Value\":\"0-2147483647\",  \r\n               \"Operator\":\"Equal\"  \r\n            }  \r\n         ]  \r\n      }  \r\n   ]  \r\n}  "
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Filters",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Filters"
							]
						},
						"description": "Create Filter\n\n[Create Filter documentation](https://docs.microsoft.com/rest/api/media/operations/filter#create_a_filter)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				}
			]
		},
		{
			"name": "AssetFilters",
			"description": "https://docs.microsoft.com/rest/api/media/operations/assetfilter",
			"item": [
				{
					"name": "List AssetFilters",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Filters",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Filters"
							]
						},
						"description": "List Filters\n\n[List Filters documentation](https://docs.microsoft.com/rest/api/media/operations/filter#list_filters)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Delete AssetFilter",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Filters('{{filterId}}')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Filters('{{filterId}}')"
							]
						},
						"description": "Delete AssetFilter\n\n[Delete AssetFilter documentation](https://docs.microsoft.com/rest/api/media/operations/assetfilter#delete_a_filter)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Create AssetFilter",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
						"body": {
							"mode": "raw",
							"raw": "{    \r\n   \"Name\":\"TestFilter\",  \r\n   \"ParentAssetId\":\"nb:cid:UUID:536e555d-1500-80c3-92dc-f1e4fdc6c592\",  \r\n   \"PresentationTimeRange\":{    \r\n      \"StartTimestamp\":\"0\",  \r\n      \"EndTimestamp\":\"9223372036854775807\",  \r\n      \"PresentationWindowDuration\":\"12000000000\",  \r\n      \"LiveBackoffDuration\":\"0\",  \r\n      \"Timescale\":\"10000000\"  \r\n   },  \r\n   \"Tracks\":[    \r\n      {    \r\n         \"PropertyConditions\":  \r\n              [    \r\n            {    \r\n               \"Property\":\"Type\",  \r\n               \"Value\":\"audio\",  \r\n               \"Operator\":\"Equal\"  \r\n            },  \r\n            {    \r\n               \"Property\":\"Bitrate\",  \r\n               \"Value\":\"0-2147483647\",  \r\n               \"Operator\":\"Equal\"  \r\n            }  \r\n         ]  \r\n      }  \r\n   ]  \r\n}  "
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Filters",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Filters"
							]
						},
						"description": "Create AssetFilter\n\n[Create AssetFilter documentation](https://docs.microsoft.com/rest/api/media/operations/assetfilter#create_a_filter)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Update AssetFilter",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
						"body": {
							"mode": "raw",
							"raw": "{  \r\n   \"Tracks\":[    \r\n      {    \r\n         \"PropertyConditions\":  \r\n         [    \r\n            {    \r\n               \"Property\":\"Type\",  \r\n               \"Value\":\"audio\",  \r\n               \"Operator\":\"Equal\"  \r\n            },  \r\n            {    \r\n               \"Property\":\"Bitrate\",  \r\n               \"Value\":\"0-2147483647\",  \r\n               \"Operator\":\"Equal\"  \r\n            }  \r\n         ]  \r\n      }  \r\n   ]  \r\n}  "
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Filters",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Filters"
							]
						},
						"description": "Update AssetFilter\n\n[Update AssetFilter documentation](https://docs.microsoft.com/rest/api/media/operations/assetfilter#update_a_filter)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				}
			]
		},
		{
			"name": "Functions",
			"description": "Rest API Functions\nhttps://msdn.microsoft.com/library/azure/jj683097.aspx\n",
			"item": [
				{
					"name": "CreateFileInfos  Function",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 204 No Content\"] = responseCode.code === 204;",
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
							"raw": "{{RESTAPIEndpoint}}/CreateFileInfos?assetid='{{LastAssetId}}'",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"CreateFileInfos"
							],
							"query": [
								{
									"key": "assetid",
									"value": "'{{LastAssetId}}'",
									"equals": true
								}
							]
						},
						"description": "Create Asset Files\nTo create the asset files on an asset, you have to use the CreateFileInfos function.\nA File entity is created using the CreateFileInfos function and passing in the Asset Id that is associated with the media file you uploaded into blob storage. For more information, see Upload a file to blob storage.\nhttps://msdn.microsoft.com/library/azure/jj683097.aspx\n\nAssetFile Entity REST API \nhttps://msdn.microsoft.com/library/azure/hh974275.aspx \n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				}
			]
		},
		{
			"name": "Jobs",
			"description": "",
			"item": [
				{
					"name": "Create Job",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 201 Created\"] = responseCode.code === 201;",
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
								"value": "2.15"
							},
							{
								"key": "Accept",
								"value": "application/json;odata=verbose"
							},
							{
								"key": "Content-Type",
								"value": "application/json;odata=verbose"
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
							"raw": "{\r\n  \"Name\": \"NewTestJob\",\r\n  \"InputMediaAssets\": [{\r\n    \"__metadata\": {\r\n      \"uri\": \"{{RESTAPIEndpoint}}/Assets('nb:cid:UUID:5710445d-1500-80c4-1256-f1e5b3ff8536')\"\r\n    }\r\n  }],\r\n  \"Tasks\": [{\r\n    \"Configuration\": \"H264 Multiple Bitrate 720p\",\r\n    \"MediaProcessorId\": \"nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56\",\r\n    \"TaskBody\": \"<?xml version=\\\"1.0\\\" encoding=\\\"utf-8\\\"?>\r\n                <taskBody>\r\n                    <inputAsset>JobInputAsset(0)</inputAsset>\r\n                    <outputAsset assetName=\\\"foobar.mp4\\\">JobOutputAsset(0)</outputAsset>\r\n                </taskBody>\"\r\n  }]\r\n}"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Jobs",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Jobs"
							]
						},
						"description": "Create Job\nA job is an entity that contains metadata about a set of tasks. Each task performs an atomic operation on the input asset(s). A job is typically used to process one audio/video presentation. If you are processing multiple videos, create a job for each video to be encoded. \n\n    NOTE: It is very important to use the JSON Verbose Accept header for the Job to submit properly. Set the Accept header to application/json;odata=verbose\n    \nThis sample creates a Job with Azure Media Encoder Standard - nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56\n\nJob Entity REST API \nhttps://msdn.microsoft.com/library/azure/hh974289.aspx\n\n\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Create Job (Encode to Multibitrate)",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 201 Created\"] = responseCode.code === 201;",
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
								"value": "2.15"
							},
							{
								"key": "Accept",
								"value": "application/json;odata=verbose"
							},
							{
								"key": "Content-Type",
								"value": "application/json;odata=verbose"
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
							"raw": "{\r\n  \"Name\": \"NewTestJob\",\r\n  \"InputMediaAssets\": [{\r\n    \"__metadata\": {\r\n     \"uri\": \"https://tvmewest.restv2.westcentralus-2.media.azure.net/api/Assets('nb:cid:UUID:847dcc53-6f4a-4bc1-925b-96538a11b8e3')\"\r\n    }\r\n  }],\r\n  \"Tasks\": [{\r\n    \"Configuration\": \"H264 Multiple Bitrate 720p\",\r\n    \"MediaProcessorId\": \"nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56\",\r\n    \"TaskBody\": \"<?xml version=\\\"1.0\\\" encoding=\\\"utf-8\\\"?>\r\n                <taskBody>\r\n                    <inputAsset>JobInputAsset(0)</inputAsset>\r\n                    <outputAsset assetName=\\\"foobar.mp4\\\">JobOutputAsset(0)</outputAsset>\r\n                </taskBody>\"\r\n  }]\r\n}"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Jobs",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Jobs"
							]
						},
						"description": "Create Job\nA job is an entity that contains metadata about a set of tasks. Each task performs an atomic operation on the input asset(s). A job is typically used to process one audio/video presentation. If you are processing multiple videos, create a job for each video to be encoded. \n\n    NOTE: It is very important to use the JSON Verbose Accept header for the Job to submit properly. Set the Accept header to application/json;odata=verbose\n    \nThis sample creates a Job with Azure Media Encoder Standard - nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56\n\nJob Entity REST API \nhttps://msdn.microsoft.com/library/azure/hh974289.aspx\n\n\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": [
						{
							"id": "6d532578-c0aa-4dc5-aa06-6ed4573639d4",
							"name": "Create Job (Encode to Multibitrate)",
							"originalRequest": {
								"method": "POST",
								"header": [
									{
										"key": "x-ms-version",
										"value": "2.15"
									},
									{
										"key": "Accept",
										"value": "application/json;odata=verbose"
									},
									{
										"key": "Content-Type",
										"value": "application/json;odata=verbose"
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
									"raw": "{\r\n  \"Name\": \"NewTestJob\",\r\n  \"InputMediaAssets\": [{\r\n    \"__metadata\": {\r\n      \"uri\": \"{{RESTAPIEndpoint}}/Assets('nb:cid:UUID:2a34b997-c651-4b68-b6bc-533ee9f9501e')\"\r\n    }\r\n  }],\r\n  \"Tasks\": [{\r\n    \"Configuration\": \"Content Adaptive Multiple Bitrate MP4\",\r\n    \"MediaProcessorId\": \"nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56\",\r\n    \"TaskBody\": \"<?xml version=\\\"1.0\\\" encoding=\\\"utf-8\\\"?>\r\n                <taskBody>\r\n                    <inputAsset>JobInputAsset(0)</inputAsset>\r\n                    <outputAsset assetName=\\\"foobar.mp4\\\">JobOutputAsset(0)</outputAsset>\r\n                </taskBody>\"\r\n  }]\r\n}\r\n"
								},
								"url": {
									"raw": "{{RESTAPIEndpoint}}/Jobs",
									"host": [
										"{{RESTAPIEndpoint}}"
									],
									"path": [
										"Jobs"
									]
								}
							},
							"status": "Created",
							"code": 201,
							"_postman_previewlanguage": "json",
							"_postman_previewtype": "text",
							"header": [
								{
									"key": "Cache-Control",
									"value": "no-cache",
									"name": "Cache-Control",
									"description": "Tells all caching mechanisms from server to client whether they may cache this object. It is measured in seconds"
								},
								{
									"key": "Content-Length",
									"value": "1278",
									"name": "Content-Length",
									"description": "The length of the response body in octets (8-bit bytes)"
								},
								{
									"key": "Content-Type",
									"value": "application/json;odata=verbose;charset=utf-8",
									"name": "Content-Type",
									"description": "The mime type of this content"
								},
								{
									"key": "DataServiceVersion",
									"value": "3.0;",
									"name": "DataServiceVersion",
									"description": "Custom header"
								},
								{
									"key": "Date",
									"value": "Thu, 09 Nov 2017 16:34:02 GMT",
									"name": "Date",
									"description": "The date and time that the message was sent"
								},
								{
									"key": "Location",
									"value": "https://tvmewest.restv2.westcentralus-2.media.azure.net/api/Jobs('nb%3Ajid%3AUUID%3A2470355d-1500-80c0-97f2-f1e7c56bca63')",
									"name": "Location",
									"description": "Used in redirection, or when a new resource has been created."
								},
								{
									"key": "Server",
									"value": "Microsoft-IIS/8.5",
									"name": "Server",
									"description": "A name for the server"
								},
								{
									"key": "Strict-Transport-Security",
									"value": "max-age=31536000; includeSubDomains",
									"name": "Strict-Transport-Security",
									"description": "A HSTS Policy informing the HTTP client how long to cache the HTTPS only policy and whether this applies to subdomains."
								},
								{
									"key": "X-Content-Type-Options",
									"value": "nosniff",
									"name": "X-Content-Type-Options",
									"description": "The only defined value, \"nosniff\", prevents Internet Explorer from MIME-sniffing a response away from the declared content-type"
								},
								{
									"key": "X-Powered-By",
									"value": "ASP.NET",
									"name": "X-Powered-By",
									"description": "Specifies the technology (ASP.NET, PHP, JBoss, e.g.) supporting the web application (version details are often in X-Runtime, X-Version, or X-AspNet-Version)"
								},
								{
									"key": "access-control-expose-headers",
									"value": "request-id, x-ms-request-id",
									"name": "access-control-expose-headers",
									"description": "Lets a server whitelist headers that browsers are allowed to access."
								},
								{
									"key": "request-id",
									"value": "adfd5998-a8f8-44e2-ac00-4b8be807230a",
									"name": "request-id",
									"description": "Custom header"
								},
								{
									"key": "x-ms-request-id",
									"value": "adfd5998-a8f8-44e2-ac00-4b8be807230a",
									"name": "x-ms-request-id",
									"description": "Custom header"
								}
							],
							"cookie": [],
							"responseTime": 895,
							"body": "{\"d\":{\"__metadata\":{\"id\":\"https://tvmewest.restv2.westcentralus-2.media.azure.net/api/Jobs('nb%3Ajid%3AUUID%3A2470355d-1500-80c0-97f2-f1e7c56bca63')\",\"uri\":\"https://tvmewest.restv2.westcentralus-2.media.azure.net/api/Jobs('nb%3Ajid%3AUUID%3A2470355d-1500-80c0-97f2-f1e7c56bca63')\",\"type\":\"Microsoft.Cloud.Media.Vod.Rest.Data.Models.Job\"},\"Tasks\":{\"__deferred\":{\"uri\":\"https://tvmewest.restv2.westcentralus-2.media.azure.net/api/Jobs('nb%3Ajid%3AUUID%3A2470355d-1500-80c0-97f2-f1e7c56bca63')/Tasks\"}},\"OutputMediaAssets\":{\"__deferred\":{\"uri\":\"https://tvmewest.restv2.westcentralus-2.media.azure.net/api/Jobs('nb%3Ajid%3AUUID%3A2470355d-1500-80c0-97f2-f1e7c56bca63')/OutputMediaAssets\"}},\"InputMediaAssets\":{\"__deferred\":{\"uri\":\"https://tvmewest.restv2.westcentralus-2.media.azure.net/api/Jobs('nb%3Ajid%3AUUID%3A2470355d-1500-80c0-97f2-f1e7c56bca63')/InputMediaAssets\"}},\"Id\":\"nb:jid:UUID:2470355d-1500-80c0-97f2-f1e7c56bca63\",\"Name\":\"NewTestJob\",\"Created\":\"2017-11-09T16:34:01.578661Z\",\"LastModified\":\"2017-11-09T16:34:01.578661Z\",\"EndTime\":null,\"Priority\":0,\"RunningDuration\":0,\"StartTime\":null,\"State\":0,\"TemplateId\":null,\"JobNotificationSubscriptions\":{\"__metadata\":{\"type\":\"Collection(Microsoft.Cloud.Media.Vod.Rest.Data.Models.JobNotificationSubscription)\"},\"results\":[]}}}"
						}
					]
				},
				{
					"name": "Create Job (Encode with custom settings)",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 201 Created\"] = responseCode.code === 201;",
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
								"value": "2.15"
							},
							{
								"key": "Accept",
								"value": "application/json;odata=verbose"
							},
							{
								"key": "Content-Type",
								"value": "application/json;odata=verbose"
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
							"raw": "{\r\n  \"Name\": \"Custom Encoding Job with Thumbnails\",\r\n  \"InputMediaAssets\": [{\r\n    \"__metadata\": {\r\n     \"uri\": \"https://tvmewest.restv2.westcentralus-2.media.azure.net/api/Assets('nb:cid:UUID:847dcc53-6f4a-4bc1-925b-96538a11b8e3')\"\r\n    }\r\n  }],\r\n  \"Tasks\": [{\r\n    \"Configuration\": \"{\r\n  'Version': 1.0,\r\n  'Codecs': [\r\n    {\r\n      'KeyFrameInterval': '00:00:02',\r\n      'SceneChangeDetection': 'true',\r\n      'H264Layers': [\r\n        {\r\n          'Profile': 'Auto',\r\n          'Level': 'auto',\r\n          'Bitrate': 4500,\r\n          'MaxBitrate': 4500,\r\n          'BufferWindow': '00:00:05',\r\n          'Width': 1280,\r\n          'Height': 720,\r\n          'ReferenceFrames': 3,\r\n          'EntropyMode': 'Cabac',\r\n          'AdaptiveBFrame': true,\r\n          'Type': 'H264Layer',\r\n          'FrameRate': '0/1'\r\n\r\n        }\r\n      ],\r\n      'Type': 'H264Video'\r\n    },\r\n    {\r\n      'JpgLayers': [\r\n        {\r\n          'Quality': 90,\r\n          'Type': 'JpgLayer',\r\n          'Width': '100%',\r\n          'Height': '100%'\r\n        }\r\n      ],\r\n      'Start': '{Best}',\r\n      'Type': 'JpgImage'\r\n    },\r\n    {\r\n      'Channels': 2,\r\n      'SamplingRate': 48000,\r\n      'Bitrate': 128,\r\n      'Type': 'AACAudio'\r\n    }\r\n  ],\r\n  'Outputs': [\r\n    {\r\n      'FileName': '{Basename}_{Index}{Extension}',\r\n      'Format': {\r\n        'Type': 'JpgFormat'\r\n      }\r\n    },\r\n    {\r\n      'FileName': '{Basename}_{Resolution}_{VideoBitrate}.mp4',\r\n      'Format': {\r\n        'Type': 'MP4Format'\r\n      }\r\n    }\r\n  ]\r\n}\",\r\n    \"MediaProcessorId\": \"nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56\",\r\n    \"TaskBody\": \"<?xml version=\\\"1.0\\\" encoding=\\\"utf-8\\\"?>\r\n                <taskBody>\r\n                    <inputAsset>JobInputAsset(0)</inputAsset>\r\n                    <outputAsset assetName=\\\"foobar.mp4\\\">JobOutputAsset(0)</outputAsset>\r\n                </taskBody>\"\r\n  }]\r\n}"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Jobs",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Jobs"
							]
						},
						"description": "Create Job\nA job is an entity that contains metadata about a set of tasks. Each task performs an atomic operation on the input asset(s). A job is typically used to process one audio/video presentation. If you are processing multiple videos, create a job for each video to be encoded. \n\n    NOTE: It is very important to use the JSON Verbose Accept header for the Job to submit properly. Set the Accept header to application/json;odata=verbose\n    \nThis sample creates a Job with a custom encoding profile.  For details see [Customizing Media Encoder Standard presets](https://docs.microsoft.com/azure/media-services/media-services-custom-mes-presets-with-dotnet)\nOr for JSON samples of our system presets, see the [Sample Presets page](https://docs.microsoft.com/azure/media-services/media-services-mes-presets-overview)\n\n[Job Entity REST API](https://msdn.microsoft.com/library/azure/hh974289.aspx)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": [
						{
							"id": "a9740355-96df-4925-8d63-52735e5a6d37",
							"name": "Create Job (Encode to Multibitrate)",
							"originalRequest": {
								"method": "POST",
								"header": [
									{
										"key": "x-ms-version",
										"value": "2.15"
									},
									{
										"key": "Accept",
										"value": "application/json;odata=verbose"
									},
									{
										"key": "Content-Type",
										"value": "application/json;odata=verbose"
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
									"raw": "{\r\n  \"Name\": \"NewTestJob\",\r\n  \"InputMediaAssets\": [{\r\n    \"__metadata\": {\r\n      \"uri\": \"{{RESTAPIEndpoint}}/Assets('nb:cid:UUID:2a34b997-c651-4b68-b6bc-533ee9f9501e')\"\r\n    }\r\n  }],\r\n  \"Tasks\": [{\r\n    \"Configuration\": \"Content Adaptive Multiple Bitrate MP4\",\r\n    \"MediaProcessorId\": \"nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56\",\r\n    \"TaskBody\": \"<?xml version=\\\"1.0\\\" encoding=\\\"utf-8\\\"?>\r\n                <taskBody>\r\n                    <inputAsset>JobInputAsset(0)</inputAsset>\r\n                    <outputAsset assetName=\\\"foobar.mp4\\\">JobOutputAsset(0)</outputAsset>\r\n                </taskBody>\"\r\n  }]\r\n}\r\n"
								},
								"url": {
									"raw": "{{RESTAPIEndpoint}}/Jobs",
									"host": [
										"{{RESTAPIEndpoint}}"
									],
									"path": [
										"Jobs"
									]
								}
							},
							"status": "Created",
							"code": 201,
							"_postman_previewlanguage": "json",
							"_postman_previewtype": "text",
							"header": [
								{
									"key": "Cache-Control",
									"value": "no-cache",
									"name": "Cache-Control",
									"description": "Tells all caching mechanisms from server to client whether they may cache this object. It is measured in seconds"
								},
								{
									"key": "Content-Length",
									"value": "1278",
									"name": "Content-Length",
									"description": "The length of the response body in octets (8-bit bytes)"
								},
								{
									"key": "Content-Type",
									"value": "application/json;odata=verbose;charset=utf-8",
									"name": "Content-Type",
									"description": "The mime type of this content"
								},
								{
									"key": "DataServiceVersion",
									"value": "3.0;",
									"name": "DataServiceVersion",
									"description": "Custom header"
								},
								{
									"key": "Date",
									"value": "Thu, 09 Nov 2017 16:34:02 GMT",
									"name": "Date",
									"description": "The date and time that the message was sent"
								},
								{
									"key": "Location",
									"value": "https://tvmewest.restv2.westcentralus-2.media.azure.net/api/Jobs('nb%3Ajid%3AUUID%3A2470355d-1500-80c0-97f2-f1e7c56bca63')",
									"name": "Location",
									"description": "Used in redirection, or when a new resource has been created."
								},
								{
									"key": "Server",
									"value": "Microsoft-IIS/8.5",
									"name": "Server",
									"description": "A name for the server"
								},
								{
									"key": "Strict-Transport-Security",
									"value": "max-age=31536000; includeSubDomains",
									"name": "Strict-Transport-Security",
									"description": "A HSTS Policy informing the HTTP client how long to cache the HTTPS only policy and whether this applies to subdomains."
								},
								{
									"key": "X-Content-Type-Options",
									"value": "nosniff",
									"name": "X-Content-Type-Options",
									"description": "The only defined value, \"nosniff\", prevents Internet Explorer from MIME-sniffing a response away from the declared content-type"
								},
								{
									"key": "X-Powered-By",
									"value": "ASP.NET",
									"name": "X-Powered-By",
									"description": "Specifies the technology (ASP.NET, PHP, JBoss, e.g.) supporting the web application (version details are often in X-Runtime, X-Version, or X-AspNet-Version)"
								},
								{
									"key": "access-control-expose-headers",
									"value": "request-id, x-ms-request-id",
									"name": "access-control-expose-headers",
									"description": "Lets a server whitelist headers that browsers are allowed to access."
								},
								{
									"key": "request-id",
									"value": "adfd5998-a8f8-44e2-ac00-4b8be807230a",
									"name": "request-id",
									"description": "Custom header"
								},
								{
									"key": "x-ms-request-id",
									"value": "adfd5998-a8f8-44e2-ac00-4b8be807230a",
									"name": "x-ms-request-id",
									"description": "Custom header"
								}
							],
							"cookie": [],
							"responseTime": 895,
							"body": "{\"d\":{\"__metadata\":{\"id\":\"https://tvmewest.restv2.westcentralus-2.media.azure.net/api/Jobs('nb%3Ajid%3AUUID%3A2470355d-1500-80c0-97f2-f1e7c56bca63')\",\"uri\":\"https://tvmewest.restv2.westcentralus-2.media.azure.net/api/Jobs('nb%3Ajid%3AUUID%3A2470355d-1500-80c0-97f2-f1e7c56bca63')\",\"type\":\"Microsoft.Cloud.Media.Vod.Rest.Data.Models.Job\"},\"Tasks\":{\"__deferred\":{\"uri\":\"https://tvmewest.restv2.westcentralus-2.media.azure.net/api/Jobs('nb%3Ajid%3AUUID%3A2470355d-1500-80c0-97f2-f1e7c56bca63')/Tasks\"}},\"OutputMediaAssets\":{\"__deferred\":{\"uri\":\"https://tvmewest.restv2.westcentralus-2.media.azure.net/api/Jobs('nb%3Ajid%3AUUID%3A2470355d-1500-80c0-97f2-f1e7c56bca63')/OutputMediaAssets\"}},\"InputMediaAssets\":{\"__deferred\":{\"uri\":\"https://tvmewest.restv2.westcentralus-2.media.azure.net/api/Jobs('nb%3Ajid%3AUUID%3A2470355d-1500-80c0-97f2-f1e7c56bca63')/InputMediaAssets\"}},\"Id\":\"nb:jid:UUID:2470355d-1500-80c0-97f2-f1e7c56bca63\",\"Name\":\"NewTestJob\",\"Created\":\"2017-11-09T16:34:01.578661Z\",\"LastModified\":\"2017-11-09T16:34:01.578661Z\",\"EndTime\":null,\"Priority\":0,\"RunningDuration\":0,\"StartTime\":null,\"State\":0,\"TemplateId\":null,\"JobNotificationSubscriptions\":{\"__metadata\":{\"type\":\"Collection(Microsoft.Cloud.Media.Vod.Rest.Data.Models.JobNotificationSubscription)\"},\"results\":[]}}}"
						}
					]
				},
				{
					"name": "Create Indexer Job ",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 201 Created\"] = responseCode.code === 201;",
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
								"value": "2.15"
							},
							{
								"key": "Accept",
								"value": "application/json;odata=verbose"
							},
							{
								"key": "Content-Type",
								"value": "application/json;odata=verbose"
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
							"raw": "{\r\n  \"Name\": \"Indexer v2 Test Job\",\r\n  \"InputMediaAssets\": [{\r\n    \"__metadata\": {\r\n      \"uri\": \"{{RESTAPIEndpoint}}/Assets('nb:cid:UUID:733f8d88-f96b-496c-a46e-38c037b89d48')\"\r\n    }\r\n  }],\r\n  \"Tasks\": [{\r\n    \"Configuration\": \"{'Version':'1.0','Features':[{'Options':{'Formats':['WebVtt','TTML'],'Language':'EnUs','Type':'RecoOptions'},'Type':'SpReco'}]}\",\r\n    \"MediaProcessorId\": \"nb:mpid:UUID:1927f26d-0aa5-4ca1-95a3-1a3f95b0f706\",\r\n    \"TaskBody\": \"<?xml version=\\\"1.0\\\" encoding=\\\"utf-8\\\"?>\r\n                <taskBody>\r\n                    <inputAsset>JobInputAsset(0)</inputAsset>\r\n                    <outputAsset assetName=\\\"foobar.mp4\\\">JobOutputAsset(0)</outputAsset>\r\n                </taskBody>\"\r\n  }]\r\n}"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Jobs",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Jobs"
							]
						},
						"description": "Create Indexer Job\n\nThis job submits a Speech Analytics job with custom configuration settings. \nNote that it uses the Media Processor ID for Indexer: \n\t\"MediaProcessorId\": \"nb:mpid:UUID:1927f26d-0aa5-4ca1-95a3-1a3f95b0f706\"\n\nAnd it uses a custom configuration JSON:\n\t \"Configuration\": \"{'Version':'1.0','Features':[{'Options':{'Formats':['WebVtt','TTML'],'Language':'EnUs','Type':'RecoOptions'},'Type':'SpReco'}]}\",\n\t \nFor details on configuring the settings of the speech analyzer, read the [Indexing Media Files](https://docs.microsoft.com/azure/media-services/media-services-process-content-with-indexer2) article\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Create Redactor Job",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 201 Created\"] = responseCode.code === 201;",
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
								"value": "2.15"
							},
							{
								"key": "Accept",
								"value": "application/json;odata=verbose"
							},
							{
								"key": "Content-Type",
								"value": "application/json;odata=verbose"
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
							"raw": "{\r\n  \"Name\": \"Indexer v2 Test Job\",\r\n  \"InputMediaAssets\": [{\r\n    \"__metadata\": {\r\n      \"uri\": \"{{RESTAPIEndpoint}}/Assets('nb:cid:UUID:733f8d88-f96b-496c-a46e-38c037b89d48')\"\r\n    }\r\n  }],\r\n  \"Tasks\": [{\r\n    \"Configuration\": '{\"Version\":\"1.0\",\"Features\":[{\"Options\":{\"Formats\":[\"WebVtt\",\"TTML\"],\"Language\":\"EnUs\",\"Type\":\"RecoOptions\"},\"Type\":\"SpReco\"}]}',\r\n    \"MediaProcessorId\": \"nb:mpid:UUID:1927f26d-0aa5-4ca1-95a3-1a3f95b0f706\",\r\n    \"TaskBody\": \"<?xml version=\\\"1.0\\\" encoding=\\\"utf-8\\\"?>\r\n                <taskBody>\r\n                    <inputAsset>JobInputAsset(0)</inputAsset>\r\n                    <outputAsset assetName=\\\"foobar.mp4\\\">JobOutputAsset(0)</outputAsset>\r\n                </taskBody>\"\r\n  }]\r\n}"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Jobs",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Jobs"
							]
						},
						"description": "This example submits a redaction job.\nFor details on configuration settings, refer to the [Redact faces with Azure Media Analytics](https://docs.microsoft.com/azure/media-services/media-services-face-redaction) article. \n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "List Jobs",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Response has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Jobs",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Jobs"
							]
						},
						"description": "List Jobs\nA job is an entity that contains metadata about a set of tasks. Each task performs an atomic operation on the input asset(s). A job is typically used to process one audio/video presentation. If you are processing multiple videos, create a job for each video to be encoded. \n\nJob Entity REST API \nhttps://msdn.microsoft.com/library/azure/hh974289.aspx\n\n\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Get Job",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 204 No Content\"] = responseCode.code === 204;",
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
								"value": "application/json;"
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
							"raw": "{{RESTAPIEndpoint}}/Jobs('nb:jid:UUID:56debcff-0300-80c0-8bf6-f1e7c1785b5c')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Jobs('nb:jid:UUID:56debcff-0300-80c0-8bf6-f1e7c1785b5c')"
							]
						},
						"description": "Get Job\nA job is an entity that contains metadata about a set of tasks. Each task performs an atomic operation on the input asset(s). A job is typically used to process one audio/video presentation. If you are processing multiple videos, create a job for each video to be encoded. \n\nJob Entity REST API \nhttps://msdn.microsoft.com/library/azure/hh974289.aspx\n\n\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Get Job State",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 204 No Content\"] = responseCode.code === 204;",
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
							"raw": "{{RESTAPIEndpoint}}/Jobs('nb:jid:UUID:bc6e241f-efa9-8a49-acc6-39700110f8d4')?$select=State",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Jobs('nb:jid:UUID:bc6e241f-efa9-8a49-acc6-39700110f8d4')"
							],
							"query": [
								{
									"key": "$select",
									"value": "State",
									"equals": true
								}
							]
						},
						"description": "Get Job State\n\nA job is an entity that contains metadata about a set of tasks. Each task performs an atomic operation on the input asset(s). A job is typically used to process one audio/video presentation. If you are processing multiple videos, create a job for each video to be encoded. \n\nJob Entity REST API \nhttps://msdn.microsoft.com/library/azure/hh974289.aspx\n\n\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Get Job State and RunningDuration",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 204 No Content\"] = responseCode.code === 204;",
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
							"raw": "{{RESTAPIEndpoint}}/Jobs('nb:jid:UUID:bc6e241f-efa9-8a49-acc6-39700110f8d4')?$select=State, RunningDuration",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Jobs('nb:jid:UUID:bc6e241f-efa9-8a49-acc6-39700110f8d4')"
							],
							"query": [
								{
									"key": "$select",
									"value": "State, RunningDuration",
									"equals": true
								}
							]
						},
						"description": "Get Job State and RunningDuration\n\nA job is an entity that contains metadata about a set of tasks. Each task performs an atomic operation on the input asset(s). A job is typically used to process one audio/video presentation. If you are processing multiple videos, create a job for each video to be encoded. \n\nJob Entity REST API \nhttps://msdn.microsoft.com/library/azure/hh974289.aspx\n\n\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				}
			]
		},
		{
			"name": "Locator",
			"description": "https://docs.microsoft.com/rest/api/media/operations/locator#create_a_locator\n\nLocator provides an entry point to access the files contained in an Asset. An AccessPolicy is used to define the permissions and duration that a client has access to a given Asset. Locators can have a many to one relationship with an AccessPolicy, such that different Locators can provide different start times and connection types to different clients while all using the same permission and duration settings; however, because of a shared access policy restriction set by Azure storage services, you cannot have more than five unique Locators associated with a given Asset at one time. For more information, see Using a Shared Access Signature (REST API).",
			"item": [
				{
					"name": "List Locators",
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
							"raw": "{{RESTAPIEndpoint}}/Locators",
							"host": [
								"{{RESTAPIEndpoint}}"
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
					"name": "Create SAS Locator",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"var json = JSON.parse(responseBody);",
									"var filename = postman.getEnvironmentVariable(\"MediaFileName\");",
									"postman.setEnvironmentVariable(\"UploadURL\", json.BaseUri + \"/\" + filename + json.ContentAccessComponent);"
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
						"body": {
							"mode": "raw",
							"raw": "{\n\t\"AccessPolicyId\": \"{{LastAccessPolicyId}}\", \n\t\"AssetId\" : \"{{LastAssetId}}\", \n\t\"Type\":1\n}  "
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Locators",
							"host": [
								"{{RESTAPIEndpoint}}"
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
					"name": "Create Streaming Locator",
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
						"body": {
							"mode": "raw",
							"raw": "{\n\t\"AccessPolicyId\": \"nb:pid:UUID:25544a8f-8ccf-43b1-a188-2a860b35bffa\", \n\t\"AssetId\" : \"nb:cid:UUID:d062e5ef-e496-4f21-87e7-17d210628b7c\", \n\t\"StartTime\" : \"2014-05-17T16:45:53\", \n\t\"Type\":2\n}  "
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Locators",
							"host": [
								"{{RESTAPIEndpoint}}"
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
					"name": "Update Locator",
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
						"method": "PATCH",
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
						"body": {
							"mode": "raw",
							"raw": "{\n\t\"StartTime\" : \"2017-10-10T00:00:00\"\n}  \n"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Locators('{{locatorId}}')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Locators('{{locatorId}}')"
							]
						},
						"description": "https://docs.microsoft.com/rest/api/media/operations/locator#list_locators"
					},
					"response": []
				},
				{
					"name": "List AccessPolicies",
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
							"raw": "{{RESTAPIEndpoint}}/AccessPolicies",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"AccessPolicies"
							]
						},
						"description": "https://docs.microsoft.com/rest/api/media/operations/locator#list_locators"
					},
					"response": []
				}
			]
		},
		{
			"name": "MediaProcessors",
			"description": "",
			"item": [
				{
					"name": "List MediaProcessors",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Response has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/MediaProcessors",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"MediaProcessors"
							]
						},
						"description": "List MediaProcessors\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				}
			]
		},
		{
			"name": "NotificationEndPoints",
			"description": "",
			"item": [
				{
					"name": "Create NotificationEndPoint",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 201 Created\"] = responseCode.code === 201;",
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
								"value": "2.15"
							},
							{
								"key": "Accept",
								"value": "application/json;odata=verbose"
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
							"raw": "  {\n      \"Name\": \"FunctionWebHook\",\n      \"EndPointAddress\": \"https://johdeufunctions.azurewebsites.net/api/Notification_Webhook_Function?code=j0txf1f8msjytzvpe40nxbpxdcxtqcgxy0nt\",\n      \"EndPointType\": 3\n  }"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/NotificationEndPoints",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"NotificationEndPoints"
							]
						},
						"description": "Create NotificationEndpoint\n\nJob Entity REST API \nhttps://msdn.microsoft.com/library/azure/hh974289.aspx\n\n\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Get NotificationEndpoints",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200 Ok\"] = responseCode.code === 200;",
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
						"body": {
							"mode": "raw",
							"raw": ""
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/NotificationEndPoints",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"NotificationEndPoints"
							]
						},
						"description": "Get NotificationEndpoints\n\nThe endpoint to which the notifications about the job state are sent. Notifications can flow to an Azure Queue or a WebHook \n\nhttps://msdn.microsoft.com/library/azure/dn169055.aspx\n\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "Delete NotificationEndpoint",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 204 No Content\"] = responseCode.code === 204;",
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
						"body": {
							"mode": "raw",
							"raw": ""
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/NotificationEndPoints('nb:nepid:UUID:1aa7afea-4bca-445b-82cd-ad6edeeea724')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"NotificationEndPoints('nb:nepid:UUID:1aa7afea-4bca-445b-82cd-ad6edeeea724')"
							]
						},
						"description": "Delete NotificationEndpoint\n\n\nhttps://msdn.microsoft.com/library/azure/dn169055.aspx\n\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "List By Filter",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200 Ok\"] = responseCode.code === 200;",
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
						"body": {
							"mode": "raw",
							"raw": ""
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/NotificationEndPoints?$top=5&$filter=startswith(Name,'WebHook')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"NotificationEndPoints"
							],
							"query": [
								{
									"key": "$top",
									"value": "5",
									"equals": true
								},
								{
									"key": "$filter",
									"value": "startswith(Name,'WebHook')",
									"equals": true
								}
							]
						},
						"description": "Get NotificationEndpoints with Filter\n\n\nThe endpoint to which the notifications about the job state are sent. Notifications can flow to an Azure Queue or a WebHook \n\nhttps://msdn.microsoft.com/library/azure/dn169055.aspx\n\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				},
				{
					"name": "List by Type",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200 Ok\"] = responseCode.code === 200;",
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
						"body": {
							"mode": "raw",
							"raw": ""
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/NotificationEndPoints?$filter=EndPointType eq 3",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"NotificationEndPoints"
							],
							"query": [
								{
									"key": "$filter",
									"value": "EndPointType eq 3",
									"equals": true
								}
							]
						},
						"description": "Get NotificationEndpoints by Type\n\n1 = Queue\n2 = Reserved\n3 = WebHook\n\n\nThe endpoint to which the notifications about the job state are sent. Notifications can flow to an Azure Queue or a WebHook \n\nhttps://msdn.microsoft.com/library/azure/dn169055.aspx\n\n\nFull REST API documentation\nhttps://msdn.microsoft.com/library/azure/hh973617.aspx"
					},
					"response": []
				}
			]
		},
		{
			"name": "Programs",
			"description": "https://docs.microsoft.com/rest/api/media/operations/program#program_properties",
			"item": [
				{
					"name": "Get Programs",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Programs",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Programs"
							]
						},
						"description": "List Programs\n\n[List Programs documentation](https://docs.microsoft.com/rest/api/media/operations/program#list_programs)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Start Program",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Programs('{{programId}}')/Start",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Programs('{{programId}}')",
								"Start"
							]
						},
						"description": "Start Programs\n\n[Start a Program documentation](https://docs.microsoft.com/rest/api/media/operations/program#start_programs)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Delete Program",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Programs('{{programId}}')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Programs('{{programId}}')"
							]
						},
						"description": "Delete Programs\n\n[Delete a Program documentation](https://docs.microsoft.com/rest/api/media/operations/program#delete_programs)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Update Program",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
						"method": "PATCH",
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
						"body": {
							"mode": "raw",
							"raw": "{\n\t\"ArchiveWindowLength\":\"PT4H\"\n}  "
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Programs('{{programId}}')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Programs('{{programId}}')"
							]
						},
						"description": "Update Programs\n\n[Update a Program documentation](https://docs.microsoft.com/rest/api/media/operations/program#update_programs)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Stop Program",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/Programs('{{programId}}')/Stop",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Programs('{{programId}}')",
								"Stop"
							]
						},
						"description": "Strop Programs\n\n[Stop a Program documentation](https://docs.microsoft.com/rest/api/media/operations/program#stop_programs)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Create Program",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
						"body": {
							"mode": "raw",
							"raw": "{\n\t\"Name\":\"testprogram001\",\n\t\"Description\":\"\",\n\t\"ChannelId\":\"nb:chid:UUID:83bb19de-7abf-4907-9578-abe90adfbabe\",\n\t\"AssetId\":\"nb:cid:UUID:bc495364-5357-42a1-9a9d-be54689cfae2\",\n\t\"ArchiveWindowLength\":\"PT1H\"\n}"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/Programs",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"Programs"
							]
						},
						"description": "Create Program\n\n[Create Programs documentation](https://docs.microsoft.com/rest/api/media/operations/program#create_programs)\n\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				}
			]
		},
		{
			"name": "StreamingEndpoint",
			"description": "https://docs.microsoft.com/rest/api/media/operations/streamingendpoint#create_streaming_endpoints\n",
			"item": [
				{
					"name": "List StreamingEndpoints",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/StreamingEndpoints",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"StreamingEndpoints"
							]
						},
						"description": "List StreamingEndpoints\n\n[List StreamingEndpoints documentation](https://docs.microsoft.com/rest/api/media/operations/streamingendpoint#list_create_streaming_endpoints)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Delete StreamingEndpoint",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/StreamingEndpoints('{{streamingEndpointId}}')",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"StreamingEndpoints('{{streamingEndpointId}}')"
							]
						},
						"description": "List StreamingEndpoints\n\n[List StreamingEndpoints documentation](https://docs.microsoft.com/rest/api/media/operations/streamingendpoint#list_create_streaming_endpoints)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Start StreamingEndpoint",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/StreamingEndpoints('{{streamingEndpointId}}')/Start",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"StreamingEndpoints('{{streamingEndpointId}}')",
								"Start"
							]
						},
						"description": "Start StreamingEndpoints\n\n[Start StreamingEndpoint documentation](https://docs.microsoft.com/rest/api/media/operations/streamingendpoint#start_create_streaming_endpoints)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Stop StreamingEndpoint",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
							"raw": "{{RESTAPIEndpoint}}/StreamingEndpoints('{{streamingEndpointId}}')/Start",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"StreamingEndpoints('{{streamingEndpointId}}')",
								"Start"
							]
						},
						"description": "Start StreamingEndpoints\n\n[Stop StreamingEndpoint documentation](https://docs.microsoft.com/rest/api/media/operations/streamingendpoint#stop_create_streaming_endpoints)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Scale StreamingEndpoint",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
						"body": {
							"mode": "raw",
							"raw": "{\n\t\"scaleUnits\" : 2\n}  "
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/StreamingEndpoints('{{streamingEndpointId}}')/Scale",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"StreamingEndpoints('{{streamingEndpointId}}')",
								"Scale"
							]
						},
						"description": "Scale StreamingEndpoints\n\n[Scale StreamingEndpoint documentation](https://docs.microsoft.com/rest/api/media/operations/streamingendpoint#scale_create_streaming_endpoints)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Create StreamingEndpoints",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
						"body": {
							"mode": "raw",
							"raw": "{\n    \"Name\": \"test-streamingendpoint-1\",\n    \"Description\": \"\",\n    \"ScaleUnits\": 0,\n    \"CustomHostNames\": [],\n    \"AccessControl\": null,\n    \"CdnEnabled\": true,\n    \"CdnProfile\": \"AzureMediaStreamingPlatformCdnProfile-StandardVerizon\",\n    \"CdnProvider\": \"StandardVerizon\",\n    \"CacheControl\":{    \n      \"MaxAge\":\"1800\"  \n\t},  \n   \"CrossSiteAccessPolicies\":{    \n      \"ClientAccessPolicy\":\"<access-policy><cross-domain-access><policy><allow-from http-request-headers='*'><domain uri='http://*' /></allow-from><grant-to><resource path='/' include-subpaths='false' /></grant-to></policy></cross-domain-access></access-policy>\",  \n      \"CrossDomainPolicy\":\"<?xml version='1.0'?><!DOCTYPE cross-domain-policy SYSTEM 'https://www.macromedia.com/xml/dtds/cross-domain-policy.dtd'><cross-domain-policy><allow-access-from domain='*' /></cross-domain-policy>\"  \n   }  \n}"
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/StreamingEndpoints",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"StreamingEndpoints"
							]
						},
						"description": "Create StreamingEndpoints\n\n[Create StreamingEndpoints documentation](https://docs.microsoft.com/rest/api/media/operations/streamingendpoint#create_streaming_endpoints)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				},
				{
					"name": "Update StreamingEndpoints",
					"event": [
						{
							"listen": "test",
							"script": {
								"type": "text/javascript",
								"exec": [
									"tests[\"Status code is 200\"] = responseCode.code === 200;",
									"",
									"",
									"var jsonData = JSON.parse(responseBody);",
									"tests[\"Has Odata.metadata\"] = jsonData.odata_metadata !== null;",
									"tests[\"Has value\"] = jsonData.value !== null;"
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
						"method": "PATCH",
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
						"body": {
							"mode": "raw",
							"raw": "{\n\t\"CacheControl\":{\n\t\t\"MaxAge\":\"2000\"\n\t}\n}  "
						},
						"url": {
							"raw": "{{RESTAPIEndpoint}}/StreamingEndpoints",
							"host": [
								"{{RESTAPIEndpoint}}"
							],
							"path": [
								"StreamingEndpoints"
							]
						},
						"description": "Update StreamingEndpoints\n\n[Update StreamingEndpoints documentation](https://docs.microsoft.com/rest/api/media/operations/streamingendpoint#update_streaming_endpoints)\n\n[Full REST API documentation](https://msdn.microsoft.com/library/azure/hh973617.aspx)"
					},
					"response": []
				}
			]
		}
	]
}
```
