---
title: "Quickstart: Extract receipt data using cURL - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll use the Form Recognizer REST API with cURL to extract data from images of sales receipts.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: quickstart
ms.date: 06/12/2019
ms.author: pafarley
#Customer intent: As a developer or data scientist familiar with cURL, I want to learn how to use a pre-trained Form Recognizer model to extract my receipt data.
---

# Quickstart: Extract receipt data using the Form Recognizer REST API with cURL

In this quickstart, you'll use the Azure Form Recognizer REST API with cURL to extract and identify relevant information in sales receipts.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
To complete this quickstart, you must have:
- Access to the Form Recognizer limited-access preview. To get access to the preview, fill out and submit the [Form Recognizer access request](https://aka.ms/FormRecognizerRequestAccess) form.
- [cURL](https://curl.haxx.se/windows/) installed.

## Create a Form Recognizer resource

[!INCLUDE [create resource](../includes/create-resource.md)]

## Sample JSON response

```json
{
  "status": "Succeeded",
  "recognitionResults": [
    {
      "page": 1,
      "clockwiseOrientation": 359.68,
      "width": 1440,
      "height": 2560,
      "unit": "pixel",
      "lines": [
        {
          "boundingBox": [
            541,
            563,
            842,
            562,
            843,
            666,
            542,
            666
          ],
          "text": "Serafina",
          "words": [
            {
              "boundingBox": [
                560,
                572,
                839,
                563,
                842,
                668,
                563,
                663
              ],
              "text": "Serafina",
              "confidenceScore": 0.39,
              "confidence": "Low"
            }
          ]
        },
        {
          "boundingBox": [
            704,
            634,
            962,
            636,
            961,
            677,
            704,
            676
          ],
          "text": "osteria & enoteca",
          "words": [
            {
              "boundingBox": [
                722,
                636,
                823,
                640,
                823,
                674,
                721,
                677
              ],
              "text": "osteria",
              "confidenceScore": 0.219,
              "confidence": "Low"
            },
            {
              "boundingBox": [
                831,
                640,
                848,
                640,
                847,
                674,
                831,
                674
              ],
              "text": "&",
              "confidenceScore": 0.998
            },
            {
              "boundingBox": [
                856,
                641,
                960,
                642,
                960,
                673,
                856,
                674
              ],
              "text": "enoteca",
              "confidenceScore": 0.708
            }
          ]
        },
        {
          "boundingBox": [
            571,
            731,
            935,
            730,
            935,
            762,
            572,
            763
          ],
          "text": "Serafina Osteria & Enoteca",
          "words": [
            {
              "boundingBox": [
                574,
                732,
                691,
                734,
                692,
                763,
                575,
                763
              ],
              "text": "Serafina",
              "confidenceScore": 0.952
            },
            {
              "boundingBox": [
                697,
                734,
                803,
                734,
                803,
                763,
                698,
                763
              ],
              "text": "Osteria",
              "confidenceScore": 0.934
            },
            {
              "boundingBox": [
                809,
                733,
                831,
                733,
                831,
                763,
                809,
                763
              ],
              "text": "&",
              "confidenceScore": 0.998
            },
            {
              "boundingBox": [
                839,
                733,
                934,
                730,
                934,
                762,
                839,
                763
              ],
              "text": "Enoteca",
              "confidenceScore": 0.987
            }
          ]
        },
        {
          "boundingBox": [
            596,
            763,
            908,
            762,
            909,
            791,
            597,
            792
          ],
          "text": "2043 East lake Ave East",
          "words": [
            {
              "boundingBox": [
                600,
                763,
                662,
                764,
                663,
                792,
                601,
                792
              ],
              "text": "2043",
              "confidenceScore": 0.985
            },
            {
              "boundingBox": [
                670,
                764,
                724,
                764,
                725,
                791,
                671,
                792
              ],
              "text": "East",
              "confidenceScore": 0.994
            },
            {
              "boundingBox": [
                730,
                764,
                788,
                764,
                788,
                791,
                731,
                791
              ],
              "text": "lake",
              "confidenceScore": 0.955
            },
            {
              "boundingBox": [
                796,
                764,
                844,
                764,
                844,
                791,
                796,
                791
              ],
              "text": "Ave",
              "confidenceScore": 0.995
            },
            {
              "boundingBox": [
                854,
                764,
                908,
                763,
                908,
                792,
                854,
                791
              ],
              "text": "East",
              "confidenceScore": 0.995
            }
          ]
        },
        {
          "boundingBox": [
            631,
            794,
            875,
            791,
            876,
            819,
            632,
            822
          ],
          "text": "Seattle, WA 98102",
          "words": [
            {
              "boundingBox": [
                635,
                794,
                755,
                793,
                755,
                821,
                635,
                823
              ],
              "text": "Seattle,",
              "confidenceScore": 0.668
            },
            {
              "boundingBox": [
                761,
                793,
                797,
                793,
                796,
                821,
                760,
                821
              ],
              "text": "WA",
              "confidenceScore": 0.997
            },
            {
              "boundingBox": [
                804,
                793,
                875,
                792,
                874,
                820,
                804,
                821
              ],
              "text": "98102",
              "confidenceScore": 0.979
            }
          ]
        },
        {
          "boundingBox": [
            667,
            823,
            847,
            821,
            848,
            850,
            668,
            852
          ],
          "text": "206.323 .0807",
          "words": [
            {
              "boundingBox": [
                672,
                823,
                767,
                824,
                767,
                851,
                672,
                853
              ],
              "text": "206.323",
              "confidenceScore": 0.596,
              "confidence": "Low"
            },
            {
              "boundingBox": [
                773,
                824,
                847,
                822,
                847,
                851,
                773,
                851
              ],
              "text": ".0807",
              "confidenceScore": 0.388,
              "confidence": "Low"
            }
          ]
        },
        {
          "boundingBox": [
            427,
            888,
            628,
            887,
            629,
            917,
            428,
            917
          ],
          "text": "Server: Beth G",
          "words": [
            {
              "boundingBox": [
                429,
                889,
                535,
                888,
                536,
                918,
                430,
                917
              ],
              "text": "Server:",
              "confidenceScore": 0.702
            },
            {
              "boundingBox": [
                541,
                888,
                603,
                888,
                603,
                917,
                541,
                918
              ],
              "text": "Beth",
              "confidenceScore": 0.973
            },
            {
              "boundingBox": [
                614,
                888,
                628,
                888,
                629,
                917,
                614,
                917
              ],
              "text": "G",
              "confidenceScore": 0.997
            }
          ]
        },
        {
          "boundingBox": [
            854,
            883,
            1089,
            884,
            1089,
            915,
            853,
            914
          ],
          "text": "06/06/18 1:11 PM",
          "words": [
            {
              "boundingBox": [
                856,
                885,
                976,
                884,
                976,
                915,
                856,
                915
              ],
              "text": "06/06/18",
              "confidenceScore": 0.89
            },
            {
              "boundingBox": [
                987,
                884,
                1048,
                884,
                1049,
                915,
                988,
                915
              ],
              "text": "1:11",
              "confidenceScore": 0.675
            },
            {
              "boundingBox": [
                1054,
                884,
                1088,
                884,
                1089,
                916,
                1055,
                915
              ],
              "text": "PM",
              "confidenceScore": 0.997
            }
          ]
        },
        {
          "boundingBox": [
            423,
            921,
            555,
            919,
            556,
            950,
            424,
            952
          ],
          "text": "Check #19",
          "words": [
            {
              "boundingBox": [
                426,
                922,
                502,
                921,
                502,
                950,
                426,
                953
              ],
              "text": "Check",
              "confidenceScore": 0.993
            },
            {
              "boundingBox": [
                512,
                921,
                555,
                922,
                555,
                949,
                512,
                950
              ],
              "text": "#19",
              "confidenceScore": 0.926
            }
          ]
        },
        {
          "boundingBox": [
            985,
            919,
            1087,
            914,
            1089,
            944,
            987,
            949
          ],
          "text": "Table 1",
          "words": [
            {
              "boundingBox": [
                988,
                919,
                1062,
                916,
                1063,
                946,
                989,
                949
              ],
              "text": "Table",
              "confidenceScore": 0.826
            },
            {
              "boundingBox": [
                1077,
                916,
                1089,
                915,
                1089,
                945,
                1078,
                946
              ],
              "text": "1",
              "confidenceScore": 0.997
            }
          ]
        },
        {
          "boundingBox": [
            421,
            982,
            587,
            984,
            586,
            1016,
            420,
            1014
          ],
          "text": "Caffe Latte",
          "words": [
            {
              "boundingBox": [
                423,
                983,
                501,
                984,
                502,
                1015,
                424,
                1015
              ],
              "text": "Caffe",
              "confidenceScore": 0.992
            },
            {
              "boundingBox": [
                509,
                984,
                585,
                985,
                586,
                1016,
                510,
                1015
              ],
              "text": "Latte",
              "confidenceScore": 0.993
            }
          ]
        },
        {
          "boundingBox": [
            1016,
            985,
            1094,
            981,
            1095,
            1009,
            1018,
            1013
          ],
          "text": "$4.50",
          "words": [
            {
              "boundingBox": [
                1019,
                984,
                1091,
                981,
                1093,
                1009,
                1020,
                1012
              ],
              "text": "$4.50",
              "confidenceScore": 0.667
            }
          ]
        },
        {
          "boundingBox": [
            419,
            1016,
            597,
            1018,
            596,
            1047,
            418,
            1046
          ],
          "text": "Italian Soda",
          "words": [
            {
              "boundingBox": [
                424,
                1017,
                528,
                1019,
                527,
                1047,
                423,
                1047
              ],
              "text": "Italian",
              "confidenceScore": 0.965
            },
            {
              "boundingBox": [
                540,
                1019,
                597,
                1019,
                596,
                1048,
                539,
                1047
              ],
              "text": "Soda",
              "confidenceScore": 0.994
            }
          ]
        },
        {
          "boundingBox": [
            1017,
            1013,
            1096,
            1011,
            1096,
            1039,
            1019,
            1042
          ],
          "text": "$3 . 50",
          "words": [
            {
              "boundingBox": [
                1019,
                1012,
                1048,
                1011,
                1049,
                1040,
                1020,
                1041
              ],
              "text": "$3",
              "confidenceScore": 0.987
            },
            {
              "boundingBox": [
                1054,
                1011,
                1058,
                1011,
                1059,
                1040,
                1055,
                1040
              ],
              "text": ".",
              "confidenceScore": 0.983
            },
            {
              "boundingBox": [
                1064,
                1011,
                1095,
                1010,
                1096,
                1039,
                1065,
                1040
              ],
              "text": "50",
              "confidenceScore": 0.997
            }
          ]
        },
        {
          "boundingBox": [
            418,
            1049,
            539,
            1051,
            538,
            1079,
            417,
            1078
          ],
          "text": "Lemonade",
          "words": [
            {
              "boundingBox": [
                420,
                1050,
                538,
                1051,
                538,
                1079,
                419,
                1077
              ],
              "text": "Lemonade",
              "confidenceScore": 0.978
            }
          ]
        },
        {
          "boundingBox": [
            1019,
            1046,
            1097,
            1044,
            1098,
            1074,
            1020,
            1077
          ],
          "text": "$3.00",
          "words": [
            {
              "boundingBox": [
                1021,
                1045,
                1095,
                1043,
                1096,
                1074,
                1022,
                1076
              ],
              "text": "$3.00",
              "confidenceScore": 0.873
            }
          ]
        },
        {
          "boundingBox": [
            413,
            1083,
            523,
            1081,
            524,
            1111,
            414,
            1113
          ],
          "text": "2 Bread",
          "words": [
            {
              "boundingBox": [
                419,
                1083,
                440,
                1083,
                439,
                1113,
                419,
                1114
              ],
              "text": "2",
              "confidenceScore": 0.996
            },
            {
              "boundingBox": [
                448,
                1083,
                525,
                1083,
                525,
                1111,
                447,
                1113
              ],
              "text": "Bread",
              "confidenceScore": 0.992
            }
          ]
        },
        {
          "boundingBox": [
            1022,
            1080,
            1101,
            1078,
            1101,
            1107,
            1021,
            1109
          ],
          "text": "$7.00",
          "words": [
            {
              "boundingBox": [
                1024,
                1079,
                1099,
                1078,
                1100,
                1107,
                1024,
                1108
              ],
              "text": "$7.00",
              "confidenceScore": 0.804
            }
          ]
        },
        {
          "boundingBox": [
            412,
            1114,
            595,
            1115,
            594,
            1145,
            411,
            1144
          ],
          "text": "2 Bruschetta",
          "words": [
            {
              "boundingBox": [
                416,
                1116,
                434,
                1116,
                436,
                1144,
                417,
                1144
              ],
              "text": "2",
              "confidenceScore": 0.997
            },
            {
              "boundingBox": [
                444,
                1116,
                595,
                1115,
                595,
                1145,
                445,
                1144
              ],
              "text": "Bruschetta",
              "confidenceScore": 0.983
            }
          ]
        },
        {
          "boundingBox": [
            1006,
            1110,
            1103,
            1108,
            1104,
            1138,
            1007,
            1141
          ],
          "text": "$28.00",
          "words": [
            {
              "boundingBox": [
                1009,
                1111,
                1102,
                1109,
                1104,
                1139,
                1010,
                1141
              ],
              "text": "$28.00",
              "confidenceScore": 0.144,
              "confidence": "Low"
            }
          ]
        },
        {
          "boundingBox": [
            407,
            1147,
            551,
            1150,
            550,
            1181,
            406,
            1179
          ],
          "text": "2 Octopus",
          "words": [
            {
              "boundingBox": [
                413,
                1149,
                433,
                1149,
                434,
                1179,
                415,
                1178
              ],
              "text": "2",
              "confidenceScore": 0.997
            },
            {
              "boundingBox": [
                442,
                1149,
                551,
                1150,
                551,
                1180,
                444,
                1180
              ],
              "text": "Octopus",
              "confidenceScore": 0.596,
              "confidence": "Low"
            }
          ]
        },
        {
          "boundingBox": [
            1007,
            1146,
            1099,
            1140,
            1101,
            1171,
            1009,
            1176
          ],
          "text": "$30.00",
          "words": [
            {
              "boundingBox": [
                1012,
                1146,
                1100,
                1142,
                1101,
                1171,
                1013,
                1176
              ],
              "text": "$30.00",
              "confidenceScore": 0.909
            }
          ]
        },
        {
          "boundingBox": [
            407,
            1183,
            566,
            1184,
            565,
            1214,
            406,
            1213
          ],
          "text": "Polpettine",
          "words": [
            {
              "boundingBox": [
                411,
                1183,
                565,
                1185,
                565,
                1214,
                411,
                1214
              ],
              "text": "Polpettine",
              "confidenceScore": 0.95
            }
          ]
        },
        {
          "boundingBox": [
            1007,
            1180,
            1103,
            1177,
            1105,
            1208,
            1009,
            1212
          ],
          "text": "$15.00",
          "words": [
            {
              "boundingBox": [
                1014,
                1181,
                1104,
                1178,
                1105,
                1207,
                1016,
                1212
              ],
              "text": "$15.00",
              "confidenceScore": 0.981
            }
          ]
        },
        {
          "boundingBox": [
            407,
            1218,
            495,
            1217,
            496,
            1248,
            407,
            1249
          ],
          "text": "Suppli",
          "words": [
            {
              "boundingBox": [
                410,
                1216,
                494,
                1216,
                494,
                1248,
                411,
                1248
              ],
              "text": "Suppli",
              "confidenceScore": 0.076,
              "confidence": "Low"
            }
          ]
        },
        {
          "boundingBox": [
            1008,
            1215,
            1109,
            1210,
            1111,
            1243,
            1010,
            1248
          ],
          "text": "$12.00",
          "words": [
            {
              "boundingBox": [
                1015,
                1216,
                1110,
                1211,
                1111,
                1243,
                1017,
                1248
              ],
              "text": "$12.00",
              "confidenceScore": 0.985
            }
          ]
        },
        {
          "boundingBox": [
            404,
            1251,
            591,
            1252,
            590,
            1287,
            404,
            1286
          ],
          "text": "3 (PF) Cozze",
          "words": [
            {
              "boundingBox": [
                408,
                1252,
                433,
                1252,
                432,
                1286,
                407,
                1286
              ],
              "text": "3",
              "confidenceScore": 0.996
            },
            {
              "boundingBox": [
                439,
                1252,
                508,
                1254,
                508,
                1286,
                439,
                1286
              ],
              "text": "(PF)",
              "confidenceScore": 0.615
            },
            {
              "boundingBox": [
                514,
                1254,
                590,
                1256,
                590,
                1285,
                514,
                1286
              ],
              "text": "Cozze",
              "confidenceScore": 0.993
            }
          ]
        },
        {
          "boundingBox": [
            1016,
            1249,
            1115,
            1245,
            1116,
            1275,
            1017,
            1278
          ],
          "text": "$60.00",
          "words": [
            {
              "boundingBox": [
                1019,
                1249,
                1113,
                1246,
                1114,
                1276,
                1021,
                1279
              ],
              "text": "$60.00",
              "confidenceScore": 0.547,
              "confidence": "Low"
            }
          ]
        },
        {
          "boundingBox": [
            399,
            1288,
            568,
            1288,
            568,
            1319,
            400,
            1320
          ],
          "text": "Cappelletti",
          "words": [
            {
              "boundingBox": [
                405,
                1289,
                567,
                1288,
                566,
                1320,
                404,
                1319
              ],
              "text": "Cappelletti",
              "confidenceScore": 0.373,
              "confidence": "Low"
            }
          ]
        },
        {
          "boundingBox": [
            1016,
            1286,
            1117,
            1282,
            1119,
            1314,
            1018,
            1318
          ],
          "text": "$16.00",
          "words": [
            {
              "boundingBox": [
                1022,
                1286,
                1117,
                1283,
                1119,
                1314,
                1023,
                1319
              ],
              "text": "$16.00",
              "confidenceScore": 0.921
            }
          ]
        },
        {
          "boundingBox": [
            398,
            1323,
            540,
            1323,
            539,
            1356,
            397,
            1355
          ],
          "text": "Spaghetti",
          "words": [
            {
              "boundingBox": [
                402,
                1323,
                540,
                1325,
                538,
                1356,
                402,
                1356
              ],
              "text": "Spaghetti",
              "confidenceScore": 0.662
            }
          ]
        },
        {
          "boundingBox": [
            1018,
            1320,
            1120,
            1316,
            1121,
            1350,
            1020,
            1354
          ],
          "text": "$15.00",
          "words": [
            {
              "boundingBox": [
                1022,
                1320,
                1121,
                1319,
                1121,
                1351,
                1022,
                1354
              ],
              "text": "$15.00",
              "confidenceScore": 0.843
            }
          ]
        },
        {
          "boundingBox": [
            399,
            1358,
            555,
            1360,
            554,
            1394,
            399,
            1392
          ],
          "text": "(PF) Cozze",
          "words": [
            {
              "boundingBox": [
                402,
                1359,
                471,
                1360,
                471,
                1392,
                402,
                1392
              ],
              "text": "(PF)",
              "confidenceScore": 0.51,
              "confidence": "Low"
            },
            {
              "boundingBox": [
                477,
                1360,
                555,
                1363,
                555,
                1392,
                477,
                1392
              ],
              "text": "Cozze",
              "confidenceScore": 0.99
            }
          ]
        },
        {
          "boundingBox": [
            1021,
            1357,
            1117,
            1352,
            1119,
            1384,
            1023,
            1388
          ],
          "text": "$20.00",
          "words": [
            {
              "boundingBox": [
                1024,
                1357,
                1118,
                1353,
                1118,
                1385,
                1025,
                1388
              ],
              "text": "$20.00",
              "confidenceScore": 0.242,
              "confidence": "Low"
            }
          ]
        },
        {
          "boundingBox": [
            410,
            1394,
            700,
            1392,
            701,
            1427,
            411,
            1429
          ],
          "text": "Side Grilled Bread",
          "words": [
            {
              "boundingBox": [
                413,
                1396,
                482,
                1394,
                481,
                1429,
                413,
                1429
              ],
              "text": "Side",
              "confidenceScore": 0.987
            },
            {
              "boundingBox": [
                491,
                1394,
                609,
                1394,
                609,
                1428,
                490,
                1429
              ],
              "text": "Grilled",
              "confidenceScore": 0.982
            },
            {
              "boundingBox": [
                616,
                1394,
                700,
                1395,
                699,
                1428,
                615,
                1428
              ],
              "text": "Bread",
              "confidenceScore": 0.993
            }
          ]
        },
        {
          "boundingBox": [
            1039,
            1395,
            1124,
            1392,
            1125,
            1424,
            1040,
            1429
          ],
          "text": "$2.00",
          "words": [
            {
              "boundingBox": [
                1042,
                1394,
                1122,
                1391,
                1123,
                1425,
                1044,
                1428
              ],
              "text": "$2.00",
              "confidenceScore": 0.986
            }
          ]
        },
        {
          "boundingBox": [
            391,
            1432,
            541,
            1434,
            540,
            1467,
            390,
            1465
          ],
          "text": "Bolognese",
          "words": [
            {
              "boundingBox": [
                393,
                1432,
                541,
                1436,
                541,
                1466,
                393,
                1466
              ],
              "text": "Bolognese",
              "confidenceScore": 0.247,
              "confidence": "Low"
            }
          ]
        },
        {
          "boundingBox": [
            1027,
            1431,
            1128,
            1428,
            1130,
            1460,
            1029,
            1464
          ],
          "text": "$16.00",
          "words": [
            {
              "boundingBox": [
                1030,
                1432,
                1129,
                1429,
                1130,
                1460,
                1032,
                1464
              ],
              "text": "$16.00",
              "confidenceScore": 0.742
            }
          ]
        },
        {
          "boundingBox": [
            388,
            1468,
            648,
            1470,
            647,
            1506,
            387,
            1504
          ],
          "text": "3 (PF) Bolognese",
          "words": [
            {
              "boundingBox": [
                393,
                1469,
                416,
                1469,
                416,
                1505,
                393,
                1505
              ],
              "text": "3",
              "confidenceScore": 0.997
            },
            {
              "boundingBox": [
                426,
                1469,
                496,
                1470,
                496,
                1505,
                426,
                1505
              ],
              "text": "(PF)",
              "confidenceScore": 0.746
            },
            {
              "boundingBox": [
                504,
                1470,
                648,
                1474,
                646,
                1504,
                503,
                1505
              ],
              "text": "Bolognese",
              "confidenceScore": 0.664
            }
          ]
        },
        {
          "boundingBox": [
            1028,
            1469,
            1127,
            1467,
            1127,
            1498,
            1030,
            1503
          ],
          "text": "$60.00",
          "words": [
            {
              "boundingBox": [
                1032,
                1468,
                1125,
                1465,
                1126,
                1499,
                1033,
                1502
              ],
              "text": "$60.00",
              "confidenceScore": 0.651
            }
          ]
        },
        {
          "boundingBox": [
            382,
            1507,
            629,
            1506,
            630,
            1542,
            383,
            1543
          ],
          "text": "2 (PF) Bucatini",
          "words": [
            {
              "boundingBox": [
                388,
                1508,
                412,
                1508,
                412,
                1544,
                388,
                1544
              ],
              "text": "2",
              "confidenceScore": 0.997
            },
            {
              "boundingBox": [
                424,
                1508,
                494,
                1508,
                494,
                1543,
                423,
                1544
              ],
              "text": "(PF)",
              "confidenceScore": 0.802
            },
            {
              "boundingBox": [
                501,
                1508,
                631,
                1508,
                631,
                1543,
                501,
                1543
              ],
              "text": "Bucatini",
              "confidenceScore": 0.983
            }
          ]
        },
        {
          "boundingBox": [
            1032,
            1507,
            1133,
            1504,
            1133,
            1538,
            1033,
            1542
          ],
          "text": "$40.00",
          "words": [
            {
              "boundingBox": [
                1034,
                1506,
                1132,
                1503,
                1133,
                1538,
                1035,
                1541
              ],
              "text": "$40.00",
              "confidenceScore": 0.261,
              "confidence": "Low"
            }
          ]
        },
        {
          "boundingBox": [
            377,
            1547,
            549,
            1551,
            548,
            1585,
            377,
            1582
          ],
          "text": "2 Menabrea",
          "words": [
            {
              "boundingBox": [
                387,
                1548,
                410,
                1549,
                409,
                1583,
                386,
                1582
              ],
              "text": "2",
              "confidenceScore": 0.997
            },
            {
              "boundingBox": [
                416,
                1549,
                550,
                1552,
                549,
                1584,
                416,
                1583
              ],
              "text": "Menabrea",
              "confidenceScore": 0.979
            }
          ]
        },
        {
          "boundingBox": [
            1035,
            1548,
            1138,
            1543,
            1139,
            1578,
            1036,
            1584
          ],
          "text": "$12.00",
          "words": [
            {
              "boundingBox": [
                1038,
                1547,
                1137,
                1542,
                1138,
                1578,
                1040,
                1583
              ],
              "text": "$12.00",
              "confidenceScore": 0.538,
              "confidence": "Low"
            }
          ]
        },
        {
          "boundingBox": [
            379,
            1586,
            650,
            1589,
            649,
            1626,
            378,
            1624
          ],
          "text": "2 Side Bru Bread",
          "words": [
            {
              "boundingBox": [
                384,
                1588,
                407,
                1588,
                408,
                1625,
                384,
                1624
              ],
              "text": "2",
              "confidenceScore": 0.996
            },
            {
              "boundingBox": [
                414,
                1588,
                490,
                1588,
                490,
                1625,
                415,
                1625
              ],
              "text": "Side",
              "confidenceScore": 0.995
            },
            {
              "boundingBox": [
                497,
                1588,
                554,
                1589,
                554,
                1626,
                497,
                1625
              ],
              "text": "Bru",
              "confidenceScore": 0.992
            },
            {
              "boundingBox": [
                563,
                1589,
                650,
                1591,
                650,
                1626,
                563,
                1626
              ],
              "text": "Bread",
              "confidenceScore": 0.993
            }
          ]
        },
        {
          "boundingBox": [
            1049,
            1589,
            1145,
            1586,
            1146,
            1619,
            1049,
            1623
          ],
          "text": "$4.00",
          "words": [
            {
              "boundingBox": [
                1056,
                1588,
                1144,
                1585,
                1145,
                1618,
                1057,
                1621
              ],
              "text": "$4.00",
              "confidenceScore": 0.902
            }
          ]
        },
        {
          "boundingBox": [
            375,
            1627,
            658,
            1628,
            657,
            1666,
            374,
            1665
          ],
          "text": "Surcharge (3.00% )",
          "words": [
            {
              "boundingBox": [
                381,
                1628,
                538,
                1628,
                537,
                1666,
                380,
                1665
              ],
              "text": "Surcharge",
              "confidenceScore": 0.981
            },
            {
              "boundingBox": [
                548,
                1628,
                643,
                1628,
                642,
                1667,
                547,
                1666
              ],
              "text": "(3.00%",
              "confidenceScore": 0.777
            },
            {
              "boundingBox": [
                651,
                1628,
                658,
                1628,
                657,
                1667,
                649,
                1667
              ],
              "text": ")",
              "confidenceScore": 0.997
            }
          ]
        },
        {
          "boundingBox": [
            1041,
            1628,
            1149,
            1627,
            1149,
            1663,
            1042,
            1665
          ],
          "text": "$10. 44",
          "words": [
            {
              "boundingBox": [
                1042,
                1627,
                1104,
                1627,
                1105,
                1664,
                1043,
                1664
              ],
              "text": "$10.",
              "confidenceScore": 0.709
            },
            {
              "boundingBox": [
                1111,
                1627,
                1146,
                1626,
                1147,
                1663,
                1112,
                1663
              ],
              "text": "44",
              "confidenceScore": 0.996
            }
          ]
        },
        {
          "boundingBox": [
            367,
            1710,
            509,
            1710,
            508,
            1749,
            366,
            1748
          ],
          "text": "Subtotal",
          "words": [
            {
              "boundingBox": [
                372,
                1710,
                507,
                1711,
                507,
                1749,
                372,
                1749
              ],
              "text": "Subtotal",
              "confidenceScore": 0.874
            }
          ]
        },
        {
          "boundingBox": [
            1029,
            1710,
            1156,
            1710,
            1156,
            1745,
            1030,
            1746
          ],
          "text": "$358 . 44",
          "words": [
            {
              "boundingBox": [
                1032,
                1711,
                1100,
                1711,
                1100,
                1747,
                1033,
                1747
              ],
              "text": "$358",
              "confidenceScore": 0.984
            },
            {
              "boundingBox": [
                1106,
                1710,
                1113,
                1710,
                1113,
                1747,
                1107,
                1747
              ],
              "text": ".",
              "confidenceScore": 0.989
            },
            {
              "boundingBox": [
                1120,
                1710,
                1155,
                1710,
                1155,
                1746,
                1120,
                1746
              ],
              "text": "44",
              "confidenceScore": 0.997
            }
          ]
        },
        {
          "boundingBox": [
            366,
            1752,
            724,
            1753,
            723,
            1793,
            365,
            1792
          ],
          "text": "Gratuity 18% (18.00% )",
          "words": [
            {
              "boundingBox": [
                369,
                1753,
                514,
                1754,
                513,
                1794,
                369,
                1792
              ],
              "text": "Gratuity",
              "confidenceScore": 0.987
            },
            {
              "boundingBox": [
                527,
                1754,
                585,
                1754,
                584,
                1794,
                526,
                1794
              ],
              "text": "18%",
              "confidenceScore": 0.986
            },
            {
              "boundingBox": [
                595,
                1754,
                707,
                1753,
                705,
                1793,
                594,
                1794
              ],
              "text": "(18.00%",
              "confidenceScore": 0.807
            },
            {
              "boundingBox": [
                714,
                1753,
                725,
                1753,
                723,
                1793,
                713,
                1793
              ],
              "text": ")",
              "confidenceScore": 0.998
            }
          ]
        },
        {
          "boundingBox": [
            367,
            1795,
            421,
            1797,
            420,
            1832,
            366,
            1832
          ],
          "text": "Tax",
          "words": [
            {
              "boundingBox": [
                368,
                1794,
                420,
                1795,
                419,
                1832,
                367,
                1831
              ],
              "text": "Tax",
              "confidenceScore": 0.996
            }
          ]
        },
        {
          "boundingBox": [
            1047,
            1756,
            1156,
            1753,
            1157,
            1789,
            1049,
            1795
          ],
          "text": "$62.64",
          "words": [
            {
              "boundingBox": [
                1051,
                1755,
                1152,
                1751,
                1154,
                1790,
                1053,
                1794
              ],
              "text": "$62.64",
              "confidenceScore": 0.604
            }
          ]
        },
        {
          "boundingBox": [
            1052,
            1796,
            1161,
            1795,
            1160,
            1833,
            1052,
            1835
          ],
          "text": "$42.53",
          "words": [
            {
              "boundingBox": [
                1056,
                1795,
                1158,
                1794,
                1158,
                1833,
                1057,
                1834
              ],
              "text": "$42.53",
              "confidenceScore": 0.664
            }
          ]
        },
        {
          "boundingBox": [
            363,
            1840,
            451,
            1840,
            451,
            1878,
            362,
            1879
          ],
          "text": "Total",
          "words": [
            {
              "boundingBox": [
                366,
                1839,
                450,
                1839,
                450,
                1878,
                367,
                1878
              ],
              "text": "Total",
              "confidenceScore": 0.887
            }
          ]
        },
        {
          "boundingBox": [
            1036,
            1842,
            1161,
            1838,
            1163,
            1878,
            1038,
            1882
          ],
          "text": "$463.61",
          "words": [
            {
              "boundingBox": [
                1040,
                1842,
                1162,
                1839,
                1162,
                1879,
                1041,
                1883
              ],
              "text": "$463.61",
              "confidenceScore": 0.555,
              "confidence": "Low"
            }
          ]
        },
        {
          "boundingBox": [
            475,
            1930,
            1050,
            1933,
            1049,
            1975,
            474,
            1973
          ],
          "text": "Serafina includes a 3% surcharge",
          "words": [
            {
              "boundingBox": [
                481,
                1931,
                631,
                1933,
                631,
                1974,
                481,
                1972
              ],
              "text": "Serafina",
              "confidenceScore": 0.962
            },
            {
              "boundingBox": [
                642,
                1933,
                788,
                1934,
                789,
                1975,
                641,
                1974
              ],
              "text": "includes",
              "confidenceScore": 0.985
            },
            {
              "boundingBox": [
                796,
                1934,
                823,
                1934,
                823,
                1975,
                797,
                1975
              ],
              "text": "a",
              "confidenceScore": 0.995
            },
            {
              "boundingBox": [
                834,
                1934,
                877,
                1934,
                877,
                1975,
                834,
                1975
              ],
              "text": "3%",
              "confidenceScore": 0.996
            },
            {
              "boundingBox": [
                885,
                1934,
                1047,
                1933,
                1048,
                1973,
                885,
                1975
              ],
              "text": "surcharge",
              "confidenceScore": 0.985
            }
          ]
        },
        {
          "boundingBox": [
            359,
            1977,
            1166,
            1975,
            1167,
            2021,
            360,
            2023
          ],
          "text": "on each guest check. 100% will be distributed",
          "words": [
            {
              "boundingBox": [
                361,
                1981,
                404,
                1981,
                403,
                2020,
                360,
                2020
              ],
              "text": "on",
              "confidenceScore": 0.997
            },
            {
              "boundingBox": [
                416,
                1981,
                492,
                1980,
                491,
                2021,
                415,
                2020
              ],
              "text": "each",
              "confidenceScore": 0.995
            },
            {
              "boundingBox": [
                504,
                1980,
                602,
                1979,
                601,
                2022,
                503,
                2021
              ],
              "text": "guest",
              "confidenceScore": 0.989
            },
            {
              "boundingBox": [
                612,
                1979,
                731,
                1978,
                729,
                2023,
                611,
                2022
              ],
              "text": "check.",
              "confidenceScore": 0.805
            },
            {
              "boundingBox": [
                738,
                1978,
                814,
                1977,
                812,
                2023,
                737,
                2023
              ],
              "text": "100%",
              "confidenceScore": 0.986
            },
            {
              "boundingBox": [
                824,
                1977,
                905,
                1977,
                903,
                2023,
                822,
                2023
              ],
              "text": "will",
              "confidenceScore": 0.97
            },
            {
              "boundingBox": [
                912,
                1977,
                957,
                1976,
                956,
                2023,
                910,
                2023
              ],
              "text": "be",
              "confidenceScore": 0.995
            },
            {
              "boundingBox": [
                973,
                1976,
                1166,
                1976,
                1164,
                2021,
                971,
                2023
              ],
              "text": "distributed",
              "confidenceScore": 0.983
            }
          ]
        },
        {
          "boundingBox": [
            484,
            2023,
            1022,
            2027,
            1021,
            2072,
            483,
            2068
          ],
          "text": "to the kitchen staff so we may",
          "words": [
            {
              "boundingBox": [
                487,
                2026,
                527,
                2025,
                528,
                2068,
                487,
                2067
              ],
              "text": "to",
              "confidenceScore": 0.997
            },
            {
              "boundingBox": [
                541,
                2025,
                598,
                2025,
                598,
                2069,
                541,
                2068
              ],
              "text": "the",
              "confidenceScore": 0.996
            },
            {
              "boundingBox": [
                606,
                2025,
                742,
                2025,
                742,
                2071,
                606,
                2069
              ],
              "text": "kitchen",
              "confidenceScore": 0.975
            },
            {
              "boundingBox": [
                753,
                2025,
                853,
                2026,
                853,
                2072,
                753,
                2071
              ],
              "text": "staff",
              "confidenceScore": 0.993
            },
            {
              "boundingBox": [
                862,
                2026,
                905,
                2027,
                904,
                2072,
                861,
                2072
              ],
              "text": "so",
              "confidenceScore": 0.997
            },
            {
              "boundingBox": [
                913,
                2027,
                959,
                2028,
                959,
                2072,
                912,
                2072
              ],
              "text": "we",
              "confidenceScore": 0.997
            },
            {
              "boundingBox": [
                968,
                2028,
                1022,
                2029,
                1021,
                2072,
                967,
                2072
              ],
              "text": "may",
              "confidenceScore": 0.996
            }
          ]
        },
        {
          "boundingBox": [
            431,
            2072,
            1093,
            2073,
            1092,
            2120,
            430,
            2119
          ],
          "text": "provide equitable wages. Thank you.",
          "words": [
            {
              "boundingBox": [
                434,
                2075,
                573,
                2073,
                573,
                2120,
                434,
                2119
              ],
              "text": "provide",
              "confidenceScore": 0.984
            },
            {
              "boundingBox": [
                582,
                2073,
                752,
                2073,
                752,
                2121,
                581,
                2121
              ],
              "text": "equitable",
              "confidenceScore": 0.978
            },
            {
              "boundingBox": [
                761,
                2073,
                888,
                2073,
                887,
                2121,
                760,
                2121
              ],
              "text": "wages.",
              "confidenceScore": 0.91
            },
            {
              "boundingBox": [
                911,
                2074,
                1010,
                2075,
                1009,
                2120,
                910,
                2121
              ],
              "text": "Thank",
              "confidenceScore": 0.989
            },
            {
              "boundingBox": [
                1018,
                2075,
                1094,
                2077,
                1092,
                2120,
                1017,
                2120
              ],
              "text": "you.",
              "confidenceScore": 0.981
            }
          ]
        }
      ]
    }
  ],
  "understandingResults": [
    {
      "pages": [
        1
      ],
      "fields": {
        "Subtotal": {
          "valueType": "numberValue",
          "value": 358.44,
          "text": "$358.44",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/56/words/0"
            },
            {
              "$ref": "#/recognitionResults/0/lines/56/words/1"
            },
            {
              "$ref": "#/recognitionResults/0/lines/56/words/2"
            }
          ]
        },
        "Total": {
          "valueType": "numberValue",
          "value": 463.61,
          "text": "$463.61",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/3/words/0"
            }
          ]
        },
        "Tax": {
          "valueType": "numberValue",
          "value": 42.53,
          "text": "$42.53",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/27/words/0"
            }
          ]
        },
        "MerchantAddress": {
          "valueType": "stringValue",
          "value": "2043 East lake Ave East Seattle, WA 98102",
          "text": "2043 East lake Ave East Seattle, WA 98102",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/12/words/0"
            },
            {
              "$ref": "#/recognitionResults/0/lines/12/words/1"
            },
            {
              "$ref": "#/recognitionResults/0/lines/12/words/2"
            },
            {
              "$ref": "#/recognitionResults/0/lines/12/words/3"
            },
            {
              "$ref": "#/recognitionResults/0/lines/12/words/4"
            },
            {
              "$ref": "#/recognitionResults/0/lines/33/words/0"
            },
            {
              "$ref": "#/recognitionResults/0/lines/33/words/1"
            },
            {
              "$ref": "#/recognitionResults/0/lines/33/words/2"
            }
          ]
        },
        "MerchantName": {
          "valueType": "stringValue",
          "value": "Serafina Osteria & Enoteca",
          "text": "Serafina Osteria & Enoteca",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/40/words/0"
            },
            {
              "$ref": "#/recognitionResults/0/lines/40/words/1"
            },
            {
              "$ref": "#/recognitionResults/0/lines/40/words/2"
            },
            {
              "$ref": "#/recognitionResults/0/lines/40/words/3"
            }
          ]
        },
        "MerchantPhoneNumber": {
          "valueType": "stringValue",
          "value": null,
          "text": "206.323 .0807",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/53/words/0"
            },
            {
              "$ref": "#/recognitionResults/0/lines/53/words/1"
            }
          ]
        },
        "TransactionDate": {
          "valueType": "stringValue",
          "value": "2018-06-06",
          "text": "06/06/18",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/51/words/0"
            }
          ]
        },
        "TransactionTime": {
          "valueType": "stringValue",
          "value": "13:11:00",
          "text": "1:11 PM",
          "elements": [
            {
              "$ref": "#/recognitionResults/0/lines/51/words/1"
            },
            {
              "$ref": "#/recognitionResults/0/lines/51/words/2"
            }
          ]
        }
      }
    }
  ]
}
```