---
title: REST SDK Developer Guide
titleSuffix: Azure Maps
description: How to develop applications that incorporate Azure Maps using the various SDK Developer how-to articles.
author: eriklindeman
ms.author: eriklind
ms.date: 10/31/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# REST SDK Developer Guide

You can call the Azure Maps [Rest API] directly from any programming language, however that can be error prone work requiring extra effort. To make incorporating Azure Maps in your applications easier and less error prone, the Azure Maps team has encapsulated their REST API in SDKs for C# (.NET), Python, JavaScript/Typescript, and Java.

This article lists the libraries currently available for each SDK with links to how-to articles to help you get started.

## C# SDK

Azure Maps C# SDK supports any .NET version that is compatible with [.NET standard 2.0].

| Service name  | NuGet package           |  Samples     |
|---------------|-------------------------|--------------|
| [Search][C# search readme] | [Azure.Maps.Search][C# search package] | [search samples][C# search sample] |
| [Routing][C# routing readme] | [Azure.Maps.Routing][C# routing package] | [routing samples][C# routing sample] |
| [Rendering][C# rendering readme]| [Azure.Maps.Rendering][C# rendering package]|[rendering sample][C# rendering sample] |
| [Geolocation][C# geolocation readme]|[Azure.Maps.Geolocation][C# geolocation package]|[geolocation sample][C# geolocation sample] |

For more information, see the [C# SDK Developers Guide].

## Python SDK

Azure Maps Python SDK supports Python version 3.7 or later. Check the [Azure SDK for Python policy planning] for more details on future Python versions.

| Service name  | PyPi package            |  Samples     |
|---------------|-------------------------|--------------|
| [Search][py search readme] | [azure-maps-search][py search package] | [search samples][py search sample] |
| [Route][py route readme] | [azure-maps-route][py route package] |  [route samples][py route sample] |
| [Render][py render readme]| [azure-maps-render][py render package]|[render sample][py render sample] |
| [Geolocation][py geolocation readme]|[azure-maps-geolocation][py geolocation package]|[geolocation sample][py geolocation sample] |

For more information, see the [python SDK Developers Guide].

## JavaScript/TypeScript

Azure Maps JavaScript/TypeScript SDK supports LTS versions of [Node.js][Node.js] including versions in Active status and Maintenance status.

| Service name  | npm packages            |  Samples     |
|---------------|-------------------------|--------------|
| [Search][js search readme] | [@azure-rest/maps-search][js search package] | [search samples][js search sample] |
| [Route][js route readme] | [@azure-rest/maps-route][js route package] | [route samples][js route sample] |
| [Render][js render readme] | [@azure-rest/maps-render][js render package]|[render sample][js render sample] |
| [Geolocation][js geolocation readme]|[@azure-rest/maps-geolocation][js geolocation package]|[geolocation sample][js geolocation sample] |

For more information, see the [JavaScript/TypeScript SDK Developers Guide].

## Java

Azure Maps Java SDK supports [Java 8][Java 8] or above.

| Service name  | Maven package           |  Samples     |
|---------------|-------------------------|--------------|
| [Search][java search readme] | [azure-maps-search][java search package] | [search samples][java search sample] |
| [Routing][java routing readme] | [azure-maps-routing][java routing package] | [routing samples][java routing sample] |
| [Rendering][java rendering readme]| [azure-maps-rendering][java rendering package]|[rendering sample][java rendering sample] |
| [Geolocation][java geolocation readme]|[azure-maps-geolocation][java geolocation package]|[geolocation sample][java geolocation sample] |
| [Timezone][java timezone readme] | [azure-maps-timezone][java timezone package] | [timezone samples][java timezone sample] |
| [Elevation][java elevation readme] ([deprecated](https://azure.microsoft.com/updates/azure-maps-elevation-apis-and-render-v2-dem-tiles-will-be-retired-on-5-may-2023)) | [azure-maps-elevation][java elevation package] | [elevation samples][java elevation sample] |

For more information, see the [Java SDK Developers Guide].

[Rest API]: /rest/api/maps/
[.NET standard 2.0]: https://dotnet.microsoft.com/platform/dotnet-standard#versions

<!--  C# SDK Developers Guide  --->
[C# SDK Developers Guide]: how-to-dev-guide-csharp-sdk.md
[C# search package]: https://www.nuget.org/packages/Azure.Maps.Search
[C# search readme]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/maps/Azure.Maps.Search/README.md
[C# search sample]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/maps/Azure.Maps.Search/samples
[C# routing package]: https://www.nuget.org/packages/Azure.Maps.Routing
[C# routing readme]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/maps/Azure.Maps.Routing/README.md
[C# routing sample]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/maps/Azure.Maps.Routing/samples
[C# rendering package]: https://www.nuget.org/packages/Azure.Maps.Rendering
[C# rendering readme]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/maps/Azure.Maps.Rendering/README.md
[C# rendering sample]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/maps/Azure.Maps.Rendering/samples
[C# geolocation package]: https://www.nuget.org/packages/Azure.Maps.geolocation
[C# geolocation readme]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/maps/Azure.Maps.Geolocation/README.md
[C# geolocation sample]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/maps/Azure.Maps.Geolocation/samples

<!--  Python SDK Developers Guide  --->
[python SDK Developers Guide]: how-to-dev-guide-py-sdk.md
[Azure SDK for Python policy planning]: https://github.com/Azure/azure-sdk-for-python/wiki/Azure-SDKs-Python-version-support-policy
[py search package]: https://pypi.org/project/azure-maps-search
[py search readme]: https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/maps/azure-maps-search/README.md
[py search sample]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/maps/azure-maps-search/samples
[py route package]: https://pypi.org/project/azure-maps-route
[py route readme]: https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/maps/azure-maps-route/README.md
[py route sample]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/maps/azure-maps-route/samples
[py render package]: https://pypi.org/project/azure-maps-render
[py render readme]: https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/maps/azure-maps-render/README.md
[py render sample]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/maps/azure-maps-render/samples
[py geolocation package]: https://pypi.org/project/azure-maps-geolocation
[py geolocation readme]: https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/maps/azure-maps-geolocation/README.md
[py geolocation sample]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/maps/azure-maps-geolocation/samples

<!--  JavaScript/TypeScript SDK Developers Guide  --->
[Node.js]: https://nodejs.org/en/download/
[JavaScript/TypeScript SDK Developers Guide]: how-to-dev-guide-js-sdk.md
[js search readme]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/maps/maps-search-rest/README.md
[js search package]: https://www.npmjs.com/package/@azure-rest/maps-search
[js search sample]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/maps/maps-search-rest/samples/v1-beta/javascript

[js route readme]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/maps/maps-route-rest/README.md
[js route package]: https://www.npmjs.com/package/@azure-rest/maps-route
[js route sample]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/maps/maps-route-rest/samples/v1-beta

[js render readme]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/maps/maps-render-rest/README.md
[js render package]: https://www.npmjs.com/package/@azure-rest/maps-render
[js render sample]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/maps/maps-render-rest/samples/v1-beta

[js Geolocation readme]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/maps/maps-geolocation-rest/README.md
[js Geolocation package]: https://www.npmjs.com/package/@azure-rest/maps-geolocation
[js Geolocation sample]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/maps/maps-geolocation-rest/samples/v1-beta

<!--  Java SDK Developers Guide  --->
[Java 8]: https://www.java.com/en/download/java8_update.jsp
[Java SDK Developers Guide]: how-to-dev-guide-java-sdk.md
[java search package]: https://repo1.maven.org/maven2/com/azure/azure-maps-search
[java search readme]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/maps/azure-maps-search/README.md
[java search sample]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/maps/azure-maps-search/src/samples/java/com/azure/maps/search/samples
[java routing package]: https://repo1.maven.org/maven2/com/azure/azure-maps-route
[java routing readme]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/maps/azure-maps-route/README.md
[java routing sample]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/maps/azure-maps-route/src/samples/java/com/azure/maps/route/samples
[java rendering package]: https://repo1.maven.org/maven2/com/azure/azure-maps-render
[java rendering readme]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/maps/azure-maps-render/README.md
[java rendering sample]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/maps/azure-maps-render/src/samples/java/com/azure/maps/render/samples
[java geolocation package]: https://repo1.maven.org/maven2/com/azure/azure-maps-geolocation
[java geolocation readme]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/maps/azure-maps-geolocation/README.md
[java geolocation sample]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/maps/azure-maps-geolocation/src/samples/java/com/azure/maps/geolocation/samples
[java timezone package]: https://repo1.maven.org/maven2/com/azure/azure-maps-timezone
[java timezone readme]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/maps/azure-maps-timezone/README.md
[java timezone sample]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/maps/azure-maps-timezone/src/samples/java/com/azure/maps/timezone/samples
[java elevation package]: https://repo1.maven.org/maven2/com/azure/azure-maps-elevation
[java elevation readme]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/maps/azure-maps-elevation/README.md
[java elevation sample]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/maps/azure-maps-elevation/src/samples/java/com/azure/maps/elevation/samples
