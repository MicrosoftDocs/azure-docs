<properties urlDisplayName="" pageTitle="Using Resource groups to manage your Azure resources" metaKeywords="" description="" metaCanonical="" services="" documentationCenter="" title="Using Resource groups to manage your Azure resources" authors="Nafisa Bhojawala"  solutions="" writer="" manager="timlt" editor=""  />

<tags ms.service="multiple" ms.workload="multiple" ms.tgt_pltfrm="ibiza" ms.devlang="na" ms.topic="article" ms.date="12/02/2014" ms.author="davidmu" />


# Using resource groups to manage your Azure resources

### Introduction

Historically, managing a resource (a user-managed entity such as a database server, database, or website) in Microsoft Azure required you to perform operations against one resource at a time. If you had a complex application made up of multiple resources, management of this application became a complex task. In the Microsoft Azure preview portal you can create resource groups to manage all your resources in an application together. Resource group is a new concept in Azure that serves as the lifecycle boundary for every resource contained within it. 
<br><br />

Resource groups enable you to manage all your resources in an application together. Resource groups are enabled by the new management functionality, Azure Resource Manager. Azure Resource Manager allows you to group multiple resources as a logical group which serves as the lifecycle boundary for every resource contained within it. Typically a group will contain resources related to a specific application. For example, a group may contain a Website resource that hosts your public website, a SQL Database that stores relational data used by the site, and a Storage Account that stores non-relational assets. 

Here is a concise overview of how to use Resource groups within the Microsoft Azure Preview Portal. 
<br><br />

### Creating resource groups

Whenever a resource is created in the preview portal, it is always created within a resource group. You can choose to create a new resource group or use an existing resource group in the create flow. <br><br />

![](http://i.imgur.com/USKkQdW.png)

<br><br />
When you create an application that consists of a few resources working together (e.g. Website + Database) it is always created in its own resource group, so you can manage the lifecycle of all related assets using the resource group. You can add or remove additional resources from the resource group as your application evolves. 

![](http://i.imgur.com/Me0jbio.png)


<br><br />

### Browsing resource groups

You can browse all resource groups by clicking the Jumpbar on the left side of your screen. A resource group has a blade that gives you all the information on a particular resource group. The Resource group blade will also give you a unified view of your billing and monitoring information for all the resources in the Resource group.

The summary section shows a visual resource map of all the resources in the resource group, it also shows resources in other resource groups that are linked to the resource group. The resource map also shows the status of each resource. 
![](http://i.imgur.com/PhJeLZQ.png)

<br><br />

The resource map part can be customized to show in a larger size which will display all the resources that are contained within the resource group and resources in other resource groups that are linked. This part can be pinned to the Starboard, which will copy the part to the Startboard.

![](http://i.imgur.com/5Wqv2XR.png)

<br><br />

  Clicking on the resource map launches the list view of all the resources on the resource map. This view will list all the resources within a resource group or linked to it. Clicking on these resources will launch their blades. 

![](http://i.imgur.com/COPjNng.png)




<br><br />

### Adding resources to resource groups

You can add resources to a resource group using the “Add” command on the resource group blade. Following the steps in the flow will allow you to add other resources to the resource group.

![](http://i.imgur.com/G79kayH.png)

Note: It is not advisable to put team project in the same resource group as other Azure resources. If you create a Team Project in a new account and group, then create a Website, the site group will default to the last group used (VSO group) and you will end up with runtime/developer resources in the same group. 



<br><br />

### Deleting resource groups

Since resource groups allow you to manage the lifecycle of all the contained resources, deleting a resource group will delete all the resources contained within it. You can also delete individual resources within a resource group. You want to exercise caution when you are deleting a resource group since there might be other resources linked to it. You can see the linked resources in the resource map and take the necessary steps to avoid any unintentional consequences when you delete resource groups. 

![](http://i.imgur.com/ZTXoISb.png)
