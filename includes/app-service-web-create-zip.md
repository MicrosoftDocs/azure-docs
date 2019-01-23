---
author: cephalin
ms.service: app-service-web
ms.topic: include
ms.date: 11/03/2016
ms.author: cephalin
---
## Create a project ZIP file

Make sure you're still in the root directory of the sample project. Create a ZIP archive of everything in your project. The following command uses the default tool in your terminal:

```
# Bash
zip -r myAppFiles.zip .

# PowerShell
Compress-Archive -Path * -DestinationPath myAppFiles.zip
``` 

Later, you upload this ZIP file to Azure and deploy it to App Service.