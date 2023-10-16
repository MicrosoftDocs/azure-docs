---
author: cephalin
ms.service: app-service
ms.topic: include
ms.date: 11/03/2016
ms.author: cephalin
ms.subservice: web-apps
---

With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called Parameters that contains all of the parameter values. You should define a parameter for those values that vary based on the project you're deploying or the environment you're deploying to. Do not define parameters for values that are constant. Each parameter value is used in the template to define the resources that are deployed.

When defining parameters, use the **allowedValues** field to specify which values a user can provide during deployment. Use the **defaultValue** field to assign a value to the parameter, if no value is provided during deployment.

We will describe each parameter in the template.

### siteName

The name of the web app that you wish to create.

```config
"siteName":{
  "type":"string"
}
```

### hostingPlanName

The name of the App Service plan to use for hosting the web app.

```config
"hostingPlanName":{
  "type":"string"
}
```

### sku

The pricing tier for the hosting plan.

```json
"sku": {
  "type": "string",
  "allowedValues": [
    "F1",
    "D1",
    "B1",
    "B2",
    "B3",
    "S1",
    "S2",
    "S3",
    "P1",
    "P2",
    "P3",
    "P4"
  ],
  "defaultValue": "S1",
  "metadata": {
    "description": "The pricing tier for the hosting plan."
  }
}
```

The template defines the values that are permitted for this parameter, and assigns a default value of `S1` if no value is specified.

### workerSize

The instance size of the hosting plan (small, medium, or large).

```json
"workerSize":{
  "type":"string",
  "allowedValues":[
    "0",
    "1",
    "2"
  ],
  "defaultValue":"0"
}
```

The template defines the values that are permitted for this parameter (`0`, `1`, or `2`), and assigns a default value of `0` if no value is specified. The values correspond to small, medium, and large.
