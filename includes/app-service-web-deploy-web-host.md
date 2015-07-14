### App Service plan

Creates the service plan for hosting the web app. You provide the name of the plan through the **hostingPlanName** parameter. The location of the plan is the 
same location used for the web app. The pricing tier and worker size are specified in the **sku** and **workerSize** parameters

    {
       "apiVersion":"2015-04-01",
       "name":"[parameters('hostingPlanName')]",
       "type":"Microsoft.Web/serverfarms",
       "location":"[parameters('siteLocation')]",
       "properties":{
         "name":"[parameters('hostingPlanName')]",
         "sku":"[parameters('sku')]",
         "workerSize":"[parameters('workerSize')]",
         "numberOfWorkers":1
       }
    }
