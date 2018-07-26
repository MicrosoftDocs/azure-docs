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

1. Hit F5 (or type `azds up` in the Terminal Window) to run the service. The service will automatically run in your newly selected space `default/scott`. 
1. You can confirm that your service is running in its own space by running `azds list-up` again. First, you'll notice an instance of `mywebapi` is now running in the `default/scott` space (the version running in the `default` is still running but it is not listed). Secondly, the access point URL for `webfrontend` is prefixed with the text "scott.s.". This URL is unique to the `default/scott` space. The special URL signifies that requests sent to the "scott URL" will try to first route to services in the `default/scott` space, but if that fails, they will fall back to services in the `default` space.

```
Name         Space          Chart              Ports   Updated     Access Points
-----------  --------       -----------------  ------  ----------  -------------
mywebapi     default/scott  mywebapi-0.1.0     80/TCP  15s ago     http://localhost:61466
webfrontend  default        webfrontend-0.1.0  80/TCP  5h ago      http://scott.s.webfrontend-contosodev.1234abcdef.eastus.aksapp.io
```

![](../media/common/space-routing.png)

This built-in feature of Azure Dev Spaces lets you test code in a shared space without requiring each developer to re-create the full stack of services in their space. This routing requires your app code to forward propagation headers, as illustrated in the previous step of this guide.

### Test code in a space
To test your new version of `mywebapi` with `webfrontend`, open your browser to the public access point URL for `webfrontend` and go to the About page. You should see your new message displayed.

Now, remove the "scott.s." part of the URL, and refresh the browser. You should see the old behavior (with the `mywebapi` version running in `default`)
