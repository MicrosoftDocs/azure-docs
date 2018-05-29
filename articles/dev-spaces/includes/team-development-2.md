---
title: "include file"
description: "include file"
ms.custom: "include file"
services: azure-dev-spaces
ms.service: "azure-dev-spaces"
ms.component: "azds-kubernetes"
author: "ghogen"
ms.author: "ghogen"
ms.date: "05/11/2018"
ms.topic: "include"
manager: "douge"
---

### Run the service

1. Hit F5 (or type `azds up` in the Terminal Window) to run the service. The service will automatically run in your newly selected space _scott_. 
1. You can confirm that your service is running in its own space by running `azds resource list` again. First, you'll notice an instance of _mywebapi_ is now running in the _scott_ space (the version running in the _default_ space is still running but it's not listed). Secondly, the access point URL for _webfrontend_ now has the prefix _scott.s._. This URL is unique to the _scott_ space, and means that requests sent to the "scott URL" will first attempt to route to services in the _scott_ space, and will fall back to services in the _default_ space.

```
Name         Space     Chart              Ports   Updated     Access Points
-----------  --------  -----------------  ------  ----------  -------------
mywebapi     scott     mywebapi-0.1.0     80/TCP  15s ago     http://localhost:61466
webfrontend  default  webfrontend-0.1.0  80/TCP  5h ago      http://scott.s.webfrontend-contosodev.1234abcdef.eastus.aksapp.io
```

![](../media/common/space-routing.png)

This built-in capability of Azure Dev Spaces enables you test code end-to-end in a shared dev space without requiring each developer to re-create the full stack of services in their space. This routing requires your app code to forward propagation headers, as illustrated in the previous step of this guide.

## Test code in a space
To test your new version of _mywebapi_ in conjunction with _webfrontend_, open your browser to the public access point URL for webfrontend and go to the About page. You should see your new message displayed.

Now, remove the _scott.s._ part of the URL, and refresh the browser. You should see the old behavior (exhibited by the _mywebapi_ version running in _default_)