---
title: REST SDK Developer Guide
titleSuffix: Azure Maps
description: How to develop applications that incorporate Azure Maps using the various SDK Developer how-to articles.
author: stevemunk
ms.author: v-munksteve
ms.date: 10/31/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# REST SDK Developer Guide

You can call the Azure Maps [Rest API][Rest API] directly from any programming language, however that can be error prone work requiring extra effort. To make incorporating Azure Maps in your applications easier and less error prone, the Azure Maps team has encapsulated their REST API in SDKs for C# (.NET), Python, JavaScript/Typescript, and Java.

This article lists the libraries currently available for each SDK with links to how-to articles to help you get started.

## C# SDK

Azure Maps C# SDK supports any .NET version that is compatible with [.NET standard 2.0][.NET Standard versions].

| Service Name  | NuGet package           |  Samples     |
|---------------|-------------------------|--------------|
| [Search][C# search readme] | [Azure.Maps.Search][C# search package] | [search samples][C# search sample] |
| [Routing][C# routing readme] | [Azure.Maps.Routing][C# routing package] | [routing samples][C# routing sample] |
| [Rendering][C# rendering readme]| [Azure.Maps.Rendering][C# rendering package]|[rendering sample][C# rendering sample] |
| [Geolocation][C# geolocation readme]|[Azure.Maps.Geolocation][C# geolocation package]|[geolocation sample][C# geolocation sample] |

For more information, see the [C# SDK Developers Guide](how-to-dev-guide-csharp-sdk.md).

## Python  SDK

Azure Maps Python SDK supports Python version 3.7 or later. Check the [Azure SDK for Python policy planning][Python-version-support-policy] for more details on future Python versions.

| Service Name  | PyPi package            |  Samples     |
|---------------|-------------------------|--------------|
| [Search][py search readme] | [azure-maps-search][py search package] | [search samples][py search sample] |
| [Routing][py routing readme] | [azure-maps-routing][py routing package] |  [routing samples][py routing sample] |
| [Rendering][py rendering readme]| [azure-maps-rendering][py rendering package]|[rendering sample][py rendering sample] |
| [Geolocation][py geolocation readme]|[azure-maps-geolocation][py geolocation package]|[geolocation sample][py geolocation sample] |

<!--For more information, see the [python SDK Developers Guide](how-to-dev-guide-py-sdk.md).-->

## JavaScript/TypeScript

Azure Maps JavaScript/TypeScript SDK supports LTS versions of [Node.js][Node.js] including versions in Active status and Maintenance status.

| Service Name  | NPM package             |  Samples     |
|---------------|-------------------------|--------------|
| [Search][js search readme] | [azure-maps-search][js search package] | [search samples][js search sample] |

<!--For more information, see the [JavaScript/TypeScript SDK Developers Guide](how-to-dev-guide-js-sdk.md).-->

## Java

Azure Maps Java SDK supports [Java 8][Java 8] or above.

| Service Name  | Maven package           |  Samples     |
|---------------|-------------------------|--------------|
| [Search][java search readme] | [azure-maps-search][java search package] | [search samples][java search sample] |
| [Routing][java routing readme] | [azure-maps-routing][java routing package] | [routing samples][java routing sample] |
| [Rendering][java rendering readme]| [azure-maps-rendering][java rendering package]|[rendering sample][java rendering sample] |
| [Geolocation][java geolocation readme]|[azure-maps-geolocation][java geolocation package]|[geolocation sample][java geolocation sample] |
| [TimeZone][java timezone readme] | [azure-maps-TimeZone][java timezone package] | [TimeZone samples][java timezone sample] |
| [Elevation][java elevation readme] | [azure-maps-Elevation][java elevation package] | [Elevation samples][java elevation sample] |

<!--For more information, see the [Java SDK Developers Guide](how-to-dev-guide-java-sdk.md).-->

<!--  C# SDK Developers Guide  --->
[Rest API]: /rest/api/maps/
[.NET Standard versions]: https://dotnet.microsoft.com/platform/dotnet-standard#versions
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
[C# geolocation readme]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/maps/Azure.Maps.geolocation/README.md
[C# geolocation sample]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/maps/Azure.Maps.Geolocation/samples

<!--  Python SDK Developers Guide  --->
[Python-version-support-policy]: https://github.com/Azure/azure-sdk-for-python/wiki/Azure-SDKs-Python-version-support-policy
[py search package]: https://pypi.org/project/azure-maps-search
[py search readme]: https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/maps/azure-maps-search/README.md
[py search sample]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/maps/azure-maps-search/samples
[py routing package]: https://pypi.org/project/azure-maps-route
[py routing readme]: https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/maps/azure-maps-routing/README.md
[py routing sample]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/maps/azure-maps-routing/samples
[py rendering package]: https://pypi.org/project/azure-maps-render
[py rendering readme]: https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/maps/azure-maps-rendering/README.md
[py rendering sample]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/maps/azure-maps-rendering/samples
[py geolocation package]: https://pypi.org/project/azure-maps-geolocation
[py geolocation readme]: https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/maps/azure-maps-geolocation/README.md
[py geolocation sample]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/maps/azure-maps-geolocation/samples

<!--  JavaScript/TypeScript SDK Developers Guide  --->
[Node.js]: https://nodejs.org/en/download/
[js search package]: https://www.npmjs.com/package/@azure/maps-search
[js search readme]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/maps/maps-search/README.md
[js search sample]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/maps/maps-search/samples/v1-beta/javascript

<!--  Java SDK Developers Guide  --->
[Java 8]: https://www.java.com/en/download/java8_update.jsp
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
