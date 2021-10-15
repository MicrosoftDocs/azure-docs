--- 
title:  Azure Maps QPS Rate Limits
description: Azure Maps limitation on the number of Queries Per Second.
author: stevemunk
ms.author: v-munksteve
ms.date: 10/15/2021
ms.topic: quickstart
ms.service: azure-maps
services: azure-maps
manager: eriklind
---

# Azure Maps QPS Rate Limits

Azure Maps does not have any maximum daily limits on the number of requests that can be made, however there are limits to the maximum number of queries per second (QPS).  Below are the QPS usage limits for each Azure Maps service.

| Azure Maps Service                                                                                         | QPS Limit   |
| ---------------------------------------------------------------------------------------------------------- | ----------- |
| Creator:  Alias, Tileset                                                                                   | 10 |
| Creator:  Conversion, Dataset, Feature State, WFS                                                          | 50 |
| Data Service and Data Service v2                                                                           | 50 |
| Elevation Service                                                                                          | 50 |
| Geolocation Service                                                                                        | 50 |
| Render Service:  Copyright                                                                                 | 10 |
| Render Service:  Contour tiles, DEM tiles, Elevation tiles, Customer tiles, Traffic tiles and Static maps  | 50 |
| Render Service:  Road tiles                                                                                | 500 |
| Render Service:  Imagery tiles                                                                             | 250 |
| Render Service:  Weather tiles                                                                             | 100 |
| Route Service:  Batch                                                                                      | 10 |
| Route Service:  Non-Batch                                                                                  | 50 |
| Search Service:  Batch                                                                                     | 10 |
| Search Service:  Non-Batch                                                                                 | 500 |
| Search Service:  Non-Batch Reverse                                                                         | 250 |
| Spatial Service                                                                                            | 50 |
| Time Zone Service                                                                                          | 50 |
| Traffic Service                                                                                            | 50 |
| Weather Service                                                                                            | 50 |

If you require a higher QPS limit, please create an Azure Maps support request via the [Azure Portal](https://ms.portal.azure.com/) to get a higher limit for the applicable Azure Maps service needed.

<!--TO DO: Details on how create an Azure Maps support request->
