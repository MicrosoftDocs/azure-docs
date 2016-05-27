<properties
   pageTitle="Managing roles in the Azure cloud services projects with Visual Studio | Microsoft Azure"
   description="Learn how to add new roles to your Azure cloud service project or remove existing roles from it by using Visual Studio."
   services="visual-studio-online"
   documentationCenter="na"
   authors="TomArcher"
   manager="douge"
   editor="" />
<tags
   ms.service="multiple"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="multiple"
   ms.date="04/18/2016"
   ms.author="tarcher" />

# Managing roles in the Azure cloud services projects with Visual Studio

After you have created your Azure cloud service project, you can add new roles to it or remove existing roles from it. You can also import an existing project and convert it to a role. For example, you can import an ASP.NET web application and designate it as a web role.

## Adding or removing roles

**To add a role**

In **Solution Explorer**, open the shortcut menu for the **Roles** node in your cloud service project and choose **Add**. You can select an existing web role or worker role from the current solution or create a new web or worker role project. Or you can select an appropriate project, such as an ASP.NET web application project, and associate it with a role project.

**To remove a role association**

In the **Roles** node of the cloud service project in Solution Explorer, open the shortcut menu for the role to remove and choose **Remove**.

## Removing and adding roles in your cloud service

If you remove a role from your cloud service project but later decide to add the role back to the project, only the role declaration and basic attributes, such as endpoints and diagnostics information, are added. No additional resources or references are added to the ServiceDefinition.csdef file or to the ServiceConfiguration.cscfg file. If you want to add this information, you’ll have to manually add it back into these files.

For example, you might remove a web service role and later you decide to add this role back into your solution. If you do this, an error will occur. To prevent this error, you have to add the `<LocalResources>` element shown in the following XML back into the ServiceDefinition.csdef file. Use the name of the web service role that you added back into the project as part of the name attribute for the **<LocalStorage>** element. In this example the name of the web service role is **WCFServiceWebRole1**.

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

Learn about how to configure roles in Visual Studio by reading [Configure the Roles for an Azure Cloud Service with Visual Studio](vs-azure-tools-configure-roles-for-cloud-service.md).
