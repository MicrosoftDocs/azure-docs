---
title: Migrate Bing Maps Geodata API to Azure Maps Get Polygon API
titleSuffix: Microsoft Azure Maps
description: Learn how to Migrate the Bing Maps Geodata API to the Azure Maps Get Polygon API.
author: pbrasil
ms.author: peterbr 
ms.date: 05/16/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Migrate Bing Maps Geodata API

This article explains how to migrate the Bing Maps [Geodata] API to the Azure Maps [Get Polygon] API. The Azure Maps Get Polygon API is used to get polygon data of a geographical area shape such as a city or a country region.

## Prerequisites

- An [Azure Account]
- An [Azure Maps account]
- A [subscription key] or other form of [Authentication with Azure Maps]

## Notable differences

- Bing Maps Geodata API supports Atom and JSON response formats. Azure Maps Get Polygon API supports the [GeoJSON] response format.
- Bing Maps Geodata API returns compressed polygons, which requires the use of a decompression algorithm to get the polygon coordinates. Azure Maps Get Polygon API returns polygon coordinates directly in the API response uncompressed, without the need to use a decompression algorithm.
- Bing Maps Geodata API uses coordinates in the latitude/longitude format. Azure Maps Get Polygon API uses coordinates in the longitude/latitude format, as defined by [GeoJSON].
- Bing Maps Geodata API returns more information about polygons that Azure Maps Get Polygon API doesn't, such as AreaSqKm, BestMapViewBox, NumPoints, PopulationClass, and WikipediaURL.
- Unlike Bing Maps Geodata API, Azure Maps Get Polygon API has a `view` input parameter, which is a string that represents an [ISO 3166-1 Alpha-2 region/country code]. The `view` input parameter alters geopolitical disputed borders and labels to align with the specified user region. For more information, see [URI Parameters].
- Unlike Bing Maps for Enterprise, Azure Maps is a global service that supports specifying a geographic scope, which allows you to limit data residency to the European (EU) or United States (US) geographic areas (geos). All requests (including input data) are processed exclusively in the specified geographic area. For more information, see [Azure Maps service geographic scope].

## Security and authentication

Bing Maps for Enterprise only supports API key authentication. Azure Maps supports multiple ways to authenticate your API calls, such as a [subscription key](azure-maps-authentication.md#shared-key-authentication), [Microsoft Entra ID], and [Shared Access Signature (SAS) Token]. For more information on security and authentication in Azure Maps, See [Authentication with Azure Maps] and the [Security section] in the Azure Maps Get Polygon documentation.

## Request parameters

The following table lists the Bing Maps _Geodata_ request parameters and the Azure Maps equivalent:

| Bing Maps request parameter  | Azure Maps request parameter  | Required in Azure Maps  | Azure Maps data type  | Description |
|-----------------------------------|------------------------------------|-------------------------|-----------------------|-------------|
| address  | Not supported   | Not supported  | Not supported  | Azure Maps Get Polygon API only supports coordinates as location input. To get the coordinates for an address, you can use the Azure Maps Get Geocoding API. |
| culture   | Request Header:  Accept-Language   | False  | string  | In Azure Maps Get Polygon API, this is the language in which search results should be returned. This is specified in the Azure Maps [request header]. For more information, see [Supported Languages].    |
| entityType  | resultType  | True  | string  | Here are the Bing Maps Geodata API to Azure Maps Get Polygon API `entityType` to `resultType` equivalents:<br><br>- AdminDivision1: adminDistrict<br>- AdminDivision2: adminDistrict2<br>-CountryRegion: countryRegion<br>-Neighborhood: neighborhood<br>-PopulatedPlace: locality<br>- Postcode1: postalCode<br>- Postcode2: postalCode2<br>- Postcode3: postalCode3<br>- Postcode4: postalCode4  |
| getAllPolygons  | Not needed  | Not needed  | Not needed  | Azure Maps Get Polygon API by default supports returning all polygons for the specified `resultType`. For example, if you're requesting the boundary of the United States, many polygons that include Alaska, Hawaii, and various outlying islands are returned, not just a single polygon representing the main boundary of the continental United States.  |
| getEntityMetadata  | Not supported   | Not supported  | Not supported  | |
| latitude, longitude  | coordinates  | | string  | Bing Maps Geodata API requires coordinates in latitude/longitude format. Azure Maps Get Polygon API requires longitude/latitude, as defined by [GeoJSON].  |
| LevelOfDetail  | resolution  | False  | string  | Here are the Bing Maps Geodata API to Azure Maps Get Polygon API LevelOfDetail to resolution equivalents: <br><br>- 0: small<br>- 1: medium<br>- 2: large<br>- 3: huge<br><br>In Azure Maps Get Polygon API, if `resolution` isn't specified, the default is `medium`.  |
| preferCuratedPolygons  | Not supported   | Not supported  | Not supported  | |
| responseFormat  | Not supported   | Not supported  | Not supported  | Azure Maps Get Polygon API only supported GeoJSON response format.  |
| userRegion  | view  | False  | string  | A string that represents an [ISO 3166-1 Alpha-2 region/country code]. This alters geopolitical disputed borders and labels to align with the specified user region. By default, the View parameter is set to `Auto` even if not defined it in the request. For more information on available Views, see [Supported Views]. |

For more information about the Azure Maps Get Polygon API request parameters, see [URI Parameters].

## Request examples

Bing Maps _Geodata_ API request:

``` http
https://platform.bing.com/geo/spatial/v1/public/Geodata?SpatialFilter=GetBoundary(40.423432,-3.674974,0,%27PopulatedPlace%27,0,1,%27en-US%27,%27US%27)&$format=json&key={BingMapsKey}
```

Azure Maps _Get Polygon_ API request:

``` http
https://atlas.microsoft.com/search/polygon?api-version=2023-06-01&coordinates=-3.6749741,40.423432&resultType=locality&resolution=small&subscription-key={Your-Azure-Maps-Subscription-key}
```

## Response fields

The following table lists the fields that can appear in the HTTP response when running the Bing Maps _Geodata_ request and the Azure Maps equivalent:

| Bing Maps response                | Azure Maps response                           | Description |
|-----------------------------------|-----------------------------------------------|-------------|
| Copyright - CopyrightURL          | properties: copyrightURL                      |             |
| Copyright - Sources               | properties: geometriesCopyright               |             |
| CopyrightSource - SourceID        | Not supported                                 |             |
| CopyrightSource - SourceName      | properties: geometriesCopyright - sourceName  |             |
| CopyrightSource - Copyright       | properties: geometriesCopyright - copyright   |             |
| EntityID                          | Not supported                                 |             |
| EntityMetadata - AreaSqKm         | Not supported                                 |             |
| EntityMetadata - BestMapViewBox   | Not supported                                 |             |
| EntityMetadata - OfficialCulture  | Not supported                                 |             |
| EntityMetadata - PopulationClass  | Not supported                                 |             |
| EntityMetadata - RegionalCulture  | Not supported                                 |             |
| EntityMetadata - WikipediaURL     | Not supported                                 |             |
| Name - EntityName                 | properties: name                              |             |
| Name - Culture                    | Not supported                                 |             |
| Name - SourceID                   | Not supported                                 |             |
| Primitives - PrimativeID          | Not supported                                 |             |
| Primitives - Shape                | GeometryCollection: geometries - coordinates  | Bing Maps Geodata API returns a comma-delimited sequence starting with the version number of the polygon set followed by a list of compressed polygon “rings” (closed paths represented by sequences of latitude/longitude points). A Bing Maps Geodata API decompression algorithm is needed to get the polygon coordinates. Azure Maps Get Polygon API returns the polygon coordinates directly in the response uncompressed, with no need to use a decompression algorithm.<br><br>Bing Maps Geodata API returns the coordinates in latitude/longitude format, whereas Azure Maps Get Polygon API returns the coordinates in longitude/latitude format, as defined by [GeoJSON].    |
| Primitives - NumPoints            | Not supported                                 |             |
| Primitives - SourceID             | Not supported                                 |             |

For more information about the Azure Maps Get Polygon API response fields, see [Definitions].

### Response examples

The following JSON sample shows what is returned in the body of the HTTP response when executing the Bing Maps _Geodata _ request:

```JSON
{
    "d": { 
        "Copyright": "© 2024 Microsoft and its suppliers.  This API and any results cannot be used or accessed without Microsoft's express written permission.", 
        "results": [ 
            { 
                "__metadata": { 
                    "uri": "https://platform.bing.com/geo/spatial/v1/public/Geodata?$filter=GetEntity(5669357583933112321L,0,1,'en-US','US')" 
                }, 
                "EntityID": "5669357583933112321", 
                "EntityMetadata": { 
                    "BestMapViewBox": "MULTIPOINT ((-4.4419009 40.0715388), (-2.9696372 40.7642994))", 
                    "EntityType": "PopulatedPlace", 
                    "PopulationClass": "PopClassOver1000000", 
                    "WikipediaURL": "http://en.wikipedia.org/wiki/Madrid" 
                }, 
                "Name": { 
                    "EntityName": "Madrid", 
                    "Culture": "en", 
                    "SourceID": "133" 
                }, 
                "Primitives": [ 
                    { 
                        "PrimitiveID": "5669358580365524997", 
                        "Shape": "1,wskhomqijBsslyC84lmC8tiEh28BrsmD18kEo48E49pHwvzCujwpBx03Ollo5DnlrQs54Dut_L51jM19vV2gwHsw3L695Cz_tB7j8Xhn0C_qgJqrsG55ZvlqDpgyDxk1Mkj4G217CmsF_2tFjwnGyv3Ej4C_zGqzTongEy4qmBw1hR_l9Sg1pd47tO0qhW0mvzB1zoDy56GzjpZol4GhxzGj9uHy3lIq7lO_7-Hh2kB3m18B3kBum9VmniGw5hEv2oE1q3Bo8c9p2BywX4mzXnylHsiN_jnG8gJ8n3C489Z_u-YixqN_oiG561H06uMiqsYxuwBvpgkC7wzEhw2I3gZp3uYn0iQr5wHn7lFr48av2nIwsuhBqgjvB85xOql1H8u9bhmZ463F5BrsW28vG48qB4gwN_hmJt74N_3rFsv2C05pF3yrEv51CtlyQggwF3k_Jqjudqt-BopnDw-9Nm89Rt92Jln3O26_UkkmDhzpch4U233Ftk4Eyn3Glv-lBn5tgB9iyCnnuD7nHn82SixmI0qlpB90sIsjnhBglrVzvxC1l4c0y7d6oiG5qjhB8q3Jg-jTjwhB9_0Np6xB461YrjpEgg0IlO0kBxwV_tTy3kGpqoGxyoE36_Du9tMj7mEkmnGnzlW0s0BnsCmiKvrC76DkjL0jb9GgiB6htB38pK5z9SqBm9iJs8xBzuqH4-I6q2Dv5pYp07Iq6gM2pkDqtxC7wkD75sP-hmMzw4G14Rw9pCunqrBp5qK48nVy62E0xiLu3iIjp_PlwBkmsJnz_E6x8Bj12EqwzhB-qlgEjppC5rrC09Hp9uB71_Eu-xkB18mBog0P_hlBviD4u9Cvv-7Bv08L9yrR57tK2-u0C3r4kC31yNvlxCkkogBzjmJ8n82C49nB_j2Z97kX68hT4l6M8x7Huu_Fly1zE36hVry8LvgKqqiH33hLkrrDu2T5hwEg9oBo2sDmpsEp-jB2wY9xzCqwsHtxzClz7H_mxCpuVggrC1qjCz_9Gj96BypvHy8qErhpEmt_Z84gM6gpDyyjCm9qB4yjCp25D03pOo1uBjutCk-jQq04Kw40H4z0C2_8I34xVzn5iBsi9MkmkM7rqHuyiWp1pDlu9Q4_2yB2_qI4_wMuluHg9rep8rI4jhlCqwolBip9Nz3xCqx5oBvqhB48kuBhyuW2pmsDswtCtysI0rjEz9oEgp3Cio0FkyjFos80Dj08F-x6Xg28boz3a3rtJ79WrrwKu_plBny4C429eng2Hx73FrpEui-yB-qb896Fon7Eyl-E9mjBqv4E_4wC_34Zxi_By2jH7l_Ol-2yB2zJ85Dnp4mBt5rB4s4FhpI-7oNvvDkj9JnunBq3xzBp7hxCo9buo8C9wpK4q9F99_L6-3jBg8_Pu9tBx-yUjlwN-36H7w2xBj8oIlp0bsvkNtusBm-xjBu37GvmNuwhyC00yCg5axkwCxp5E5ztYn_gQ6mmCq0vb28wSp-yKzs4Km4sKsooH6_T531B_24GmyhC73vCkkpE8rmMijaj-xKn7pHxjhB78lOspwB1o3Il_xK75oR69G3jgEy0tDwg_PxkyIm4nF1oyJxkuFk3tCr_yGnj6IovyIigMn9nsEuryNt18JvqwhC_3ogBzt9Csm3P_lvBjw3BjjuV4whBpjPzwiC7wUtZt4oE_4xGq-7hB903OplsDl-6CxkvH4xglBo6pF_z4P-tEk8Yl0jQ7hf8h1Bj5wBi4M1qkPx4S365Igp9B3_sRrmS4hjE5wmS00GuzhBs97C5vtB7ktBo50B-5hDx4vEq0ZjniLskQ8kqpB1m43D1px8DivnG1kqR2-koB787FjzvBvmrFh0mF3ouI12Z1vL6ijC6w5D8o0Bmcy3d_gE_41C939Iilu9BwhyGrkhBsmkK1-3sBhtkb09zQ9n0cgqvG4i7rDph6D9p_sDoluPn9oR3s4hC8up7Co-zgB7uEwtIhj8XyqwhBzpo9B9h76B85phCy6FtmY7p2lBg1tsEukSqzmGvvrlV6llMu1idyh0gEtu_1Cp23mBt25M-oovB38nG-hhBux4CjqmB7ouCgj-Fiz0kBl6vctx2Wi1EmpiBy69lBs10Xkz6Dp3dqt97BljoLhooBrznRvt0Fwq2B_26tE4uR15lkB5_qD8n8wBspu0B2kxN1h1Kg78BisuVw9tPopiT90vF0u7yB8klV", 
                        "NumPoints": "554", 
                        "SourceID": "5" 
                    } 
                ], 
                "Copyright": { 
                    "CopyrightURL": "http://windows.microsoft.com/en-us/windows-live/about-bing-data-suppliers", 
                    "Sources": [ 
                        { 
                            "SourceID": "5", 
                            "SourceName": "TOM", 
                            "Copyright": "TomTom" 
                        } 
                    ] 
                } 
            } 
        ] 
    } 
}  
```

The following JSON sample shows what is returned in the body of the HTTP response when executing an Azure Maps _Get Polygon_ request:

```JSON
{
    "type":"Feature",
    "geometry": {
        "type":"GeometryCollection",
        "geometries":[ {
            "type": "Polygon", "coordinates":[[[-3.59839, 40.312070000000006], [-3.5874500000000005, 40.31273], [-3.5782200000000004, 40.313860000000005], [-3.57622, 40.314800000000005], [-3.5779, 40.314710000000005], [-3.5792400000000004, 40.31566], [-3.5813300000000003, 40.31618], [-3.58387, 40.31588], [-3.5850400000000002, 40.31817], [-3.58442, 40.322100000000006], [-3.5828200000000003, 40.32625], [-3.5794500000000005, 40.32779], [-3.5719300000000005, 40.334360000000004], [-3.5698800000000004, 40.337480000000006], [-3.56958, 40.33966], [-3.5673000000000004, 40.341800000000006], [-3.5653, 40.34425], [-3.5621000000000005, 40.34698], [-3.5607900000000003, 40.349120000000006], [-3.5583700000000005, 40.351130000000005], [-3.55765, 40.35255], [-3.55656, 40.352990000000005], [-3.55323, 40.35591], [-3.5530100000000004, 40.36126], [-3.55486, 40.35987], [-3.5555600000000003, 40.36032], [-3.55602, 40.362190000000005], [-3.5553200000000005, 40.3639], [-3.5525700000000002, 40.365700000000004], [-3.5511000000000004, 40.37008], [-3.55119, 40.3731], [-3.55025, 40.375350000000005], [-3.5486600000000004, 40.37711], [-3.54897, 40.38082], [-3.5455, 40.385270000000006], [-3.5435800000000004, 40.388630000000006], [-3.5424300000000004, 40.393040000000006], [-3.5372800000000004, 40.39126], [-3.5327900000000003, 40.391630000000006], [-3.5290800000000004, 40.38933], [-3.5268200000000003, 40.38973], [-3.5241100000000003, 40.39088], [-3.52177, 40.391200000000005], [-3.5203200000000003, 40.39206], [-3.5197700000000003, 40.396150000000006], [-3.5185400000000002, 40.39996], [-3.5180100000000003, 40.402460000000005], [-3.51907, 40.405170000000005], [-3.5190400000000004, 40.40863], [-3.5208600000000003, 40.412040000000005], [-3.52226, 40.41389], [-3.5244400000000002, 40.415330000000004], [-3.5250900000000005, 40.41630000000001], [-3.5310500000000005, 40.42006000000001], [-3.5302000000000002, 40.414680000000004], [-3.5327500000000005, 40.41407], [-3.5351200000000005, 40.414280000000005], [-3.5361300000000004, 40.41264], [-3.5375900000000002, 40.41241], [-3.5383500000000003, 40.411410000000004], [-3.5396, 40.411550000000005], [-3.5396400000000003, 40.41049], [-3.5492500000000002, 40.4123], [-3.5507400000000002, 40.411820000000006], [-3.55168, 40.412180000000006], [-3.5534700000000004, 40.41174], [-3.55858, 40.41304], [-3.5645100000000003, 40.41351], [-3.57236, 40.411910000000006], [-3.5774500000000002, 40.41344], [-3.5796400000000004, 40.417570000000005], [-3.5754400000000004, 40.42549], [-3.5777300000000003, 40.42595], [-3.5767100000000003, 40.428700000000006], [-3.5768500000000003, 40.42969], [-3.57934, 40.433530000000005], [-3.57487, 40.43419], [-3.5757800000000004, 40.43679], [-3.5737600000000005, 40.43768], [-3.5685800000000003, 40.436220000000006], [-3.5660900000000004, 40.43773], [-3.5602600000000004, 40.43816], [-3.5520000000000005, 40.441520000000004], [-3.54245, 40.44332], [-3.5411400000000004, 40.44371], [-3.5407, 40.444500000000005], [-3.5380900000000004, 40.444160000000004], [-3.53838, 40.44502000000001], [-3.5355600000000003, 40.44471], [-3.5349600000000003, 40.44496], [-3.5352200000000003, 40.44635], [-3.5311200000000005, 40.446870000000004], [-3.53291, 40.44896000000001], [-3.53433, 40.452510000000004], [-3.5321300000000004, 40.454600000000006], [-3.53094, 40.4547], [-3.5287400000000004, 40.454100000000004], [-3.5267800000000005, 40.45497], [-3.5265400000000002, 40.456070000000004], [-3.5290500000000002, 40.45863000000001], [-3.5294800000000004, 40.460890000000006], [-3.52821, 40.46406], [-3.5250100000000004, 40.467800000000004], [-3.5250100000000004, 40.46904000000001], [-3.52653, 40.470380000000006], [-3.53066, 40.471610000000005], [-3.5324000000000004, 40.47471], [-3.5342000000000002, 40.476150000000004], [-3.5351000000000004, 40.48091], [-3.5373200000000002, 40.484550000000006], [-3.53696, 40.486470000000004], [-3.5413300000000003, 40.488910000000004], [-3.54171, 40.48977], [-3.5414900000000005, 40.49244], [-3.5424900000000004, 40.49452], [-3.5450100000000004, 40.49618], [-3.5505700000000004, 40.49795], [-3.5556200000000002, 40.501340000000006], [-3.5548300000000004, 40.50303], [-3.5552500000000005, 40.503220000000006], [-3.55514, 40.50864000000001], [-3.55426, 40.51142], [-3.56225, 40.511190000000006], [-3.5650100000000005, 40.51214], [-3.5720400000000003, 40.51249000000001], [-3.5757200000000005, 40.51057], [-3.57797, 40.510450000000006], [-3.58292, 40.50853], [-3.58475, 40.506780000000006], [-3.5891300000000004, 40.504580000000004], [-3.5933300000000004, 40.50141], [-3.60279, 40.501430000000006], [-3.6035200000000005, 40.502010000000006], [-3.60591, 40.50435], [-3.6058000000000003, 40.50583], [-3.61005, 40.50784], [-3.61085, 40.50883], [-3.6126300000000002, 40.509310000000006], [-3.61513, 40.511120000000005], [-3.6181400000000004, 40.51024], [-3.62109, 40.51026], [-3.6228900000000004, 40.50918], [-3.6257, 40.509530000000005], [-3.6285000000000003, 40.50851], [-3.6310900000000004, 40.50855000000001], [-3.63322, 40.50773], [-3.6420500000000002, 40.508320000000005], [-3.6449300000000004, 40.508100000000006], [-3.6481000000000003, 40.51057], [-3.65241, 40.511230000000005], [-3.6547400000000003, 40.512930000000004], [-3.6560400000000004, 40.51317], [-3.6578000000000004, 40.51156], [-3.6586000000000003, 40.51176], [-3.6591000000000005, 40.513720000000006], [-3.66155, 40.51758], [-3.6628600000000002, 40.52008], [-3.6661500000000005, 40.52123], [-3.6655400000000005, 40.52299], [-3.6658800000000005, 40.52460000000001], [-3.6676100000000003, 40.52514], [-3.67201, 40.52451000000001], [-3.6752200000000004, 40.52577], [-3.6772000000000005, 40.527120000000004], [-3.67104, 40.53211], [-3.66923, 40.53457], [-3.6720200000000003, 40.537560000000006], [-3.6740800000000005, 40.5384], [-3.67559, 40.540980000000005], [-3.6779200000000003, 40.542930000000005], [-3.67871, 40.54553000000001], [-3.67857, 40.546760000000006], [-3.6824000000000003, 40.551170000000006], [-3.6823600000000005, 40.554010000000005], [-3.6853300000000004, 40.558530000000005], [-3.6868600000000002, 40.56322], [-3.68948, 40.5688], [-3.6893100000000003, 40.57056], [-3.69043, 40.56996], [-3.6905900000000003, 40.569230000000005], [-3.6914100000000003, 40.56996], [-3.69498, 40.57374], [-3.69695, 40.575010000000006], [-3.6982200000000005, 40.57696000000001], [-3.6998300000000004, 40.578140000000005], [-3.70155, 40.57826], [-3.7015100000000003, 40.578610000000005], [-3.6993300000000002, 40.5786], [-3.6914100000000003, 40.58059], [-3.6888600000000005, 40.58245], [-3.6846, 40.58352], [-3.6821200000000003, 40.585170000000005], [-3.66745, 40.592020000000005], [-3.6621400000000004, 40.59212], [-3.6605600000000003, 40.591660000000005], [-3.65614, 40.58881], [-3.6546200000000004, 40.586450000000006], [-3.6510300000000004, 40.57811], [-3.6502700000000003, 40.57744], [-3.64753, 40.57694], [-3.6442900000000003, 40.576930000000004], [-3.6399200000000005, 40.575140000000005], [-3.6350100000000003, 40.57446], [-3.6306200000000004, 40.574650000000005], [-3.628, 40.57368], [-3.6249900000000004, 40.57379], [-3.6163200000000004, 40.580670000000005], [-3.6118600000000005, 40.582080000000005], [-3.6089700000000002, 40.583600000000004], [-3.6087700000000003, 40.58411], [-3.60644, 40.58518], [-3.6049700000000002, 40.58796], [-3.6035200000000005, 40.58885], [-3.6023300000000003, 40.59010000000001], [-3.6018200000000005, 40.59207000000001], [-3.6035200000000005, 40.593120000000006], [-3.60483, 40.59449], [-3.6052100000000005, 40.59644], [-3.6069100000000005, 40.596810000000005], [-3.60876, 40.598440000000004], [-3.6105400000000003, 40.59873], [-3.61296, 40.599900000000005], [-3.61642, 40.601490000000005], [-3.61614, 40.603060000000006], [-3.6171, 40.605470000000004], [-3.61683, 40.606930000000006], [-3.61837, 40.60889], [-3.6179500000000004, 40.61113], [-3.61987, 40.61186], [-3.6224600000000002, 40.615790000000004], [-3.6265000000000005, 40.61688], [-3.6285300000000005, 40.61834], [-3.6286000000000005, 40.61975], [-3.6294500000000003, 40.620760000000004], [-3.6287900000000004, 40.62259], [-3.6301500000000004, 40.626070000000006], [-3.6296600000000003, 40.627610000000004], [-3.63011, 40.62854], [-3.6328600000000004, 40.630930000000006], [-3.63756, 40.63797], [-3.6387600000000004, 40.638670000000005], [-3.6444, 40.638360000000006], [-3.6486500000000004, 40.64166], [-3.65201, 40.642900000000004], [-3.6556100000000002, 40.64352], [-3.6584000000000003, 40.642340000000004], [-3.6616000000000004, 40.63976], [-3.66725, 40.63143], [-3.6682900000000003, 40.62917], [-3.6684500000000004, 40.62632000000001], [-3.6670000000000003, 40.623070000000006], [-3.6666800000000004, 40.6199], [-3.6713500000000003, 40.61751], [-3.6743400000000004, 40.61679], [-3.6793000000000005, 40.611110000000004], [-3.6849800000000004, 40.60897000000001], [-3.6875000000000004, 40.6069], [-3.6883100000000004, 40.605470000000004], [-3.6910900000000004, 40.60007], [-3.6914100000000003, 40.59908], [-3.6963100000000004, 40.590090000000004], [-3.7053400000000005, 40.584920000000004], [-3.7052000000000005, 40.583070000000006], [-3.7083600000000003, 40.58362], [-3.7104800000000004, 40.58314], [-3.7130000000000005, 40.583270000000006], [-3.7145, 40.58265], [-3.71729, 40.5829], [-3.71938, 40.58209], [-3.7301, 40.585210000000004], [-3.73342, 40.58536], [-3.73722, 40.58615], [-3.73815, 40.58652], [-3.74073, 40.590700000000005], [-3.7458000000000005, 40.59225], [-3.7492600000000005, 40.59272], [-3.7501100000000003, 40.59248], [-3.7528900000000003, 40.594750000000005], [-3.75842, 40.596140000000005], [-3.75979, 40.597030000000004], [-3.7658500000000004, 40.598560000000006], [-3.76813, 40.599610000000006], [-3.7705100000000003, 40.599920000000004], [-3.7782800000000005, 40.601760000000006], [-3.7793, 40.60159], [-3.7816500000000004, 40.600840000000005], [-3.7828700000000004, 40.601760000000006], [-3.7835400000000003, 40.60177], [-3.7851000000000004, 40.60047], [-3.7863700000000002, 40.600390000000004], [-3.7898300000000003, 40.59901], [-3.79537, 40.599970000000006], [-3.7970400000000004, 40.59985], [-3.7991200000000003, 40.598510000000005], [-3.8035500000000004, 40.599030000000006], [-3.8003000000000005, 40.604890000000005], [-3.8004200000000004, 40.605470000000004], [-3.8005000000000004, 40.605830000000005], [-3.8061100000000003, 40.60783], [-3.80628, 40.60947], [-3.8091000000000004, 40.609280000000005], [-3.80954, 40.60987], [-3.8126900000000004, 40.608180000000004], [-3.8101800000000003, 40.606640000000006], [-3.80967, 40.605470000000004], [-3.80608, 40.59987], [-3.8126, 40.596830000000004], [-3.81436, 40.595420000000004], [-3.81612, 40.595000000000006], [-3.8202000000000003, 40.59503], [-3.8226800000000005, 40.594390000000004], [-3.8278200000000004, 40.59465], [-3.8332400000000004, 40.593560000000004], [-3.83557, 40.59203], [-3.8377200000000005, 40.59138], [-3.8404700000000003, 40.592400000000005], [-3.84323, 40.592510000000004], [-3.8456300000000003, 40.591370000000005], [-3.85007, 40.59049], [-3.85489, 40.588010000000004], [-3.85991, 40.5882], [-3.8635900000000003, 40.58953], [-3.8658500000000005, 40.591640000000005], [-3.8671900000000003, 40.59208], [-3.86729, 40.59214], [-3.8739000000000003, 40.591150000000006], [-3.8761500000000004, 40.59004], [-3.8761, 40.589270000000006], [-3.8769000000000005, 40.588620000000006], [-3.8836600000000003, 40.585260000000005], [-3.8835100000000002, 40.582550000000005], [-3.8842600000000003, 40.58127], [-3.8839200000000003, 40.578430000000004], [-3.8857000000000004, 40.574250000000006], [-3.88844, 40.572210000000005], [-3.8890000000000002, 40.570870000000006], [-3.8869700000000003, 40.566190000000006], [-3.88384, 40.563810000000004], [-3.8850200000000004, 40.560790000000004], [-3.88228, 40.55948], [-3.8782400000000004, 40.55939], [-3.8754500000000003, 40.558730000000004], [-3.8751500000000005, 40.558020000000006], [-3.87393, 40.55758], [-3.8729700000000005, 40.55521], [-3.8728800000000003, 40.553470000000004], [-3.8706600000000004, 40.55102], [-3.86905, 40.5482], [-3.86939, 40.54733], [-3.8671900000000003, 40.545440000000006], [-3.8656200000000003, 40.54355], [-3.8655000000000004, 40.542370000000005], [-3.8638500000000002, 40.53931], [-3.86296, 40.534740000000006], [-3.86059, 40.53295000000001], [-3.85807, 40.530150000000006], [-3.8576, 40.52788], [-3.8561000000000005, 40.527010000000004], [-3.8536200000000003, 40.52438], [-3.8543900000000004, 40.5214], [-3.8533500000000003, 40.519510000000004], [-3.8513200000000003, 40.51758], [-3.8522300000000005, 40.5155], [-3.8533600000000003, 40.514430000000004], [-3.8540000000000005, 40.51198], [-3.8523700000000005, 40.509640000000005], [-3.8370800000000003, 40.50585], [-3.8386500000000003, 40.502700000000004], [-3.8393800000000002, 40.4994], [-3.8345200000000004, 40.49416], [-3.83319, 40.487770000000005], [-3.8341800000000004, 40.484190000000005], [-3.8366700000000002, 40.480920000000005], [-3.8373800000000005, 40.4757], [-3.8362100000000003, 40.474680000000006], [-3.8374400000000004, 40.47303], [-3.8381100000000004, 40.47091], [-3.8382400000000003, 40.467760000000006], [-3.8342400000000003, 40.464310000000005], [-3.8309300000000004, 40.46591], [-3.8289600000000004, 40.46629], [-3.8271100000000002, 40.46598], [-3.8247700000000004, 40.46482], [-3.8173900000000005, 40.46441], [-3.8151500000000005, 40.4637], [-3.8128800000000003, 40.463710000000006], [-3.81056, 40.46419], [-3.8104800000000005, 40.464580000000005], [-3.8051100000000004, 40.463680000000004], [-3.8047400000000002, 40.462790000000005], [-3.8033300000000003, 40.46255], [-3.8026800000000005, 40.46162], [-3.8014600000000005, 40.461310000000005], [-3.7987800000000003, 40.45875], [-3.7958800000000004, 40.45785], [-3.7954700000000003, 40.45649], [-3.7928900000000003, 40.45382], [-3.7933100000000004, 40.4532], [-3.7922100000000003, 40.451710000000006], [-3.7910500000000003, 40.44785], [-3.79036, 40.447700000000005], [-3.7901700000000003, 40.446580000000004], [-3.7888200000000003, 40.44576], [-3.7892200000000003, 40.444630000000004], [-3.7886, 40.44373], [-3.7874600000000003, 40.444230000000005], [-3.7831300000000003, 40.44431], [-3.78257, 40.44511000000001], [-3.7793, 40.444120000000005], [-3.7775000000000003, 40.44368], [-3.7706800000000005, 40.4436], [-3.7707800000000002, 40.42969], [-3.7793, 40.42392], [-3.7804100000000003, 40.42183], [-3.78141, 40.417500000000004], [-3.7793, 40.411500000000004], [-3.7788100000000004, 40.40889000000001], [-3.77633, 40.403960000000005], [-3.7744000000000004, 40.40204000000001], [-3.77457, 40.40021], [-3.7760900000000004, 40.40001], [-3.7776300000000003, 40.39905], [-3.7781100000000003, 40.39764], [-3.7793, 40.39717], [-3.78195, 40.39397], [-3.7854, 40.393080000000005], [-3.79042, 40.392320000000005], [-3.79246, 40.39356], [-3.7937600000000002, 40.393550000000005], [-3.79646, 40.39217], [-3.7989100000000002, 40.39211], [-3.8048800000000003, 40.39202], [-3.8108600000000004, 40.39271], [-3.8148500000000003, 40.39394], [-3.8193400000000004, 40.396300000000004], [-3.8210100000000002, 40.39652], [-3.8350800000000005, 40.396100000000004], [-3.8335100000000004, 40.39491], [-3.8279500000000004, 40.387370000000004], [-3.82547, 40.384820000000005], [-3.82343, 40.381400000000006], [-3.8183800000000003, 40.37621], [-3.8128800000000003, 40.36948], [-3.8104700000000005, 40.36366], [-3.8070100000000004, 40.36645], [-3.80283, 40.363220000000005], [-3.7945200000000003, 40.36151], [-3.78764, 40.35857], [-3.7793, 40.36222], [-3.7733300000000005, 40.359860000000005], [-3.7718400000000005, 40.359590000000004], [-3.7716300000000005, 40.35985], [-3.7607600000000003, 40.357730000000004], [-3.75992, 40.357940000000006], [-3.75768, 40.35712], [-3.73579, 40.36202], [-3.7273400000000003, 40.36455], [-3.72102, 40.36513], [-3.7240800000000003, 40.341800000000006], [-3.72494, 40.33469], [-3.7241100000000005, 40.33348], [-3.72068, 40.331], [-3.71504, 40.328010000000006], [-3.7147900000000003, 40.32705], [-3.71315, 40.32616], [-3.71253, 40.323690000000006], [-3.70325, 40.32209], [-3.6966200000000002, 40.32229], [-3.6933100000000003, 40.32045], [-3.6920800000000003, 40.320240000000005], [-3.6914100000000003, 40.320890000000006], [-3.6849600000000002, 40.322320000000005], [-3.6821800000000002, 40.32361], [-3.6809700000000003, 40.32446], [-3.6803700000000004, 40.325630000000004], [-3.6792000000000002, 40.32623], [-3.67403, 40.32574], [-3.6703600000000005, 40.324940000000005], [-3.6681600000000003, 40.325520000000004], [-3.6639600000000003, 40.32883], [-3.66305, 40.328860000000006], [-3.6611300000000004, 40.32771], [-3.6598300000000004, 40.327690000000004], [-3.6500200000000005, 40.332150000000006], [-3.6490700000000005, 40.333110000000005], [-3.6442200000000002, 40.33034000000001], [-3.6430900000000004, 40.32905], [-3.6373100000000003, 40.325880000000005], [-3.6323600000000003, 40.321740000000005], [-3.6292000000000004, 40.32001], [-3.6260600000000003, 40.31897], [-3.6251800000000003, 40.31985], [-3.62447, 40.31992], [-3.6199800000000004, 40.319120000000005], [-3.6162600000000005, 40.31781], [-3.6133400000000004, 40.31514000000001], [-3.61119, 40.31429000000001], [-3.6035200000000005, 40.312830000000005], [-3.59839, 40.312070000000006]]]
        }
        ]
    }
    ,
    "properties": {

        "name":"Madrid",
        "copyright":"© 2024 Microsoft and its suppliers. This API and any results cannot be used or accessed without Microsoft's express written permission.",
        "copyrightURL":"https://azure.microsoft.com/support/legal/preview-supplemental-terms/",
        "geometriesCopyright":[ {
            "sourceName": "TOM", "copyright":"TomTom"
        }

        ]
    }
}
```

## Transactions usage

Like Bing Maps Geodata API, Azure Maps Get Polygon API logs one billable transaction per request. For more information on Azure Maps transactions, see [Understanding Azure Maps Transactions].

## Additional information

- Azure Maps [Get Geocoding] API: Use to get latitude and longitude coordinates of a street address or name of a place.
- Azure Maps [Get Geocoding Batch] API: Use to send a batch of queries to the Azure Maps Get Geocoding API in a single request.

Support

- [Microsoft Q&A Forum]

[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Account]: https://azure.microsoft.com/
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps service geographic scope]: geographic-scope.md
[Definitions]: /rest/api/maps/search/get-polygon#definitions
[Geodata]: /bingmaps/spatial-data-services/geodata-api
[GeoJSON]: https://geojson.org
[Get Geocoding Batch]: /rest/api/maps/search/get-geocoding-batch
[Get Geocoding]: /rest/api/maps/search/get-geocoding
[Get Polygon]: /rest/api/maps/search/get-polygon
[ISO 3166-1 Alpha-2 region/country code]: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
[Microsoft Entra ID]: azure-maps-authentication.md#microsoft-entra-authentication
[Microsoft Q&A Forum]: /answers/tags/209/azure-maps
[request header]: /rest/api/maps/search/get-polygon?#request-headers
[Security section]: /rest/api/maps/search/get-polygon#security
[Shared Access Signature (SAS) Token]: azure-maps-authentication.md#shared-access-signature-token-authentication
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Supported Languages]: supported-languages.md
[Supported Views]: supported-languages.md#azure-maps-supported-views
[Understanding Azure Maps Transactions]: understanding-azure-maps-transactions.md
[URI Parameters]: /rest/api/maps/search/get-polygon#uri-parameters
