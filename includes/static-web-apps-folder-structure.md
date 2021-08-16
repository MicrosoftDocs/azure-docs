---
author: craigshoemaker
ms.service: static-web-apps
ms.topic: include
ms.date: 03/25/2021
ms.author: cshoe
---

| Property | Description | Example | Required |
|---|---|---|---|
| `app_location` | Location of your application code. | Enter `/` if your application source code is at the root of the repository, or `/app` if your application code is in a directory called `app`. | Yes |
| `api_location` | Location of your Azure Functions code. | Enter `/api` if your app code is in a folder called `api`. If no Azure Functions app is detected in the folder, the build doesn't fail, the workflow assumes you don't want an API. | No |
| `output_location` | Location of the build output directory relative to the `app_location`. | If your application source code is located at `/app`, and the build script outputs files to the `/app/build` folder, then set `build` as the `output_location` value. | No |