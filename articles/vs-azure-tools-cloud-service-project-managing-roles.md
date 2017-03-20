---
title: Managing roles in the Azure cloud services projects with Visual Studio | Microsoft Docs
description: Learn how to add new roles to your Azure cloud service project or remove existing roles from it by using Visual Studio.
services: visual-studio-online
documentationcenter: na
author: TomArcher
manager: douge
editor: ''

ms.assetid: 5ec9ae2e-8579-4e5d-999e-8ae05b629bd1
ms.service: multiple
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 03/19/2017
ms.author: tarcher

---
# Managing roles in the Azure cloud services projects with Visual Studio
After you have created your Azure cloud service project, you can add new roles to it or remove existing roles from it. You can also import an existing project and convert it to a role. For example, you can import an ASP.NET web application and designate it as a web role.

## Adding or removing roles
**To add a role**

1. Create or open an Azure Cloud Service project in Visual Studio.

1. In **Solution Explorer**, expand the project node

1. Right-click the **Nodes** node to display the context menu. From the context menu, you can select an existing web role or worker role from the current solution or create a web or worker role project. You can also select an appropriate project, such as an ASP.NET web application project, and associate it with a role project.

**To remove a role association**

1. Create or open an Azure Cloud Service project in Visual Studio.

1. In **Solution Explorer**, expand the project node

1. Expand the **Nodes** node.

1. Right-click the node you want to remove, and, from the context menu, select **Remove**. 

## Removing and adding roles in your cloud service
If you remove a role from your cloud service project but later decide to add the role back to the project, only the role declaration and basic attributes, such as endpoints and diagnostics information, are added. No additional resources or references are added to the `ServiceDefinition.csdef` file or to the `ServiceConfiguration.cscfg` file. If you want to add this information, you need to manually add it back into these files.

For example, you might remove a web service role and later you decide to add this role back into your solution. If you do this, an error will occur. To prevent this error, you have to add the `<LocalResources>` element shown in the following XML back into the `ServiceDefinition.csdef` file. Use the name of the web service role that you added back into the project as part of the name attribute for the **<LocalStorage>** element. In this example, the name of the web service role is **WCFServiceWebRole1**.

    <WebRole name="WCFServiceWebRole1">
        <Sites>
          <Site name="Web">
            <Bindings>
              <Binding name="Endpoint1" endpointName="Endpoint1" />
            </Bindings>
          </Site>
        </Sites>
        <Endpoints>
          <InputEndpoint name="Endpoint1" protocol="http" port="80" />
        </Endpoints>
        <Imports>
          <Import moduleName="Diagnostics" />
        </Imports>
       <LocalResources>
          <LocalStorage name="WCFServiceWebRole1.svclog" sizeInMB="1000" cleanOnRoleRecycle="false" />
       </LocalResources>
    </WebRole>

## Next steps
- [Configure the Roles for an Azure Cloud Service with Visual Studio](vs-azure-tools-configure-roles-for-cloud-service.md)

