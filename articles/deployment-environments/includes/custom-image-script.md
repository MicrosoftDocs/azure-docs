---
ms.service: deployment-environments
ms.topic: include
author: RoseHJM
ms.author: rosemalcolm
ms.date: 05/23/2024
---

Microsoft provides a quickstart script to help you get started. The script builds your image and pushes it to a specified Azure Container Registry (ACR) under the repository `ade` and the tag `latest`. 

To use the script, you must:

1. Create a Dockerfile and scripts folder to support the ADE extensibility model. 
1. Supply a registry name and directory for your custom image.
1. Have the Azure CLI and Docker Desktop installed and in your PATH variables.
1. Have permissions to push to the specified registry.

You can view the script [here](https://github.com/Azure/deployment-environments/blob/main/Runner-Images/quickstart-image-build.ps1). 

You can call the script using the following command in PowerShell:
```powershell
.\quickstart-image-build.ps1 -Registry '{YOUR_REGISTRY}' -Directory '{DIRECTORY_TO_YOUR_IMAGE}'
```
Additionally, if you would like to push to a specific repository and tag name, you can run:
```powershell
.\quickstart-image.build.ps1 -Registry '{YOUR_REGISTRY}' -Directory '{DIRECTORY_TO_YOUR_IMAGE}' -Repository '{YOUR_REPOSITORY}' -Tag '{YOUR_TAG}'
```