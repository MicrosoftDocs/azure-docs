<properties
    pageTitle="Publish an app to a remote cluster with VS | Microsoft Azure"
    description="Learn about the steps needed to publish an application to a remote service fabric cluster by using Visual Studio."
    services="service-fabric"
    documentationCenter="na"
    authors="cawa"
    manager="timlt"
    editor="" />

<tags
    ms.service="multiple"
    ms.devlang="dotnet"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="multiple"
    ms.date="10/28/2015"
    ms.author="cawa" />

# Publish an application to a remote cluster using Visual Studio

Visual Studio Service Fabric Tools provide an easy, repeatable, and scriptable way to publish an application to a Service Fabric cluster. This is done by using a PowerShell deployment script with publish profiles. Publish profiles are .XML format files that store essential publishing information. The **Publish Service Fabric Application** dialog box has also been added to enable users easily publishing an application to a local or remote cluster. Any setting changes made through the Publish dialog are captured in the publish profiles. This enables you to use manually edit publish settings in an automation process later.

## Artifacts needed to publish an application to a Service Fabric cluster

### Deploy-FabricApplication.ps1

This is a PowerShell script that uses a publish profile path as a parameter for publishing Service Fabric applications.

### Publish profiles

A folder in the Service Fabric Application project called **PublishProfiles** contains the files **Cloud.XML** and **Local.XML**. These are "publish profiles" that store essential information for publishing an application, such as:
- Service Fabric cluster connection parameters
- Path to an application parameter file
- Upgrade settings

### Application parameter files

A folder in the Service Fabric application project called **ApplicationParameters** contains XML files for user-specified application manifest parameter values. Application manifest files can be parameterized so that you can use different values for deployment settings.

For example, you can change the partition count to fit into different environments for each deployment. When you create a project, the settings in the application manifest, such as **TargetReplicaSetSize** and **PartitionCount**, are converted to parameters. The default value of these parameters is specified in the **Parameters** section of the application manifest file (ApplicationManifest.XML, located in the Service Fabric application project). Any values you add to the application parameter file will override the default values in the application manifest file.

>[AZURE.NOTE] For Actor services, you should build the project first to generate the parameters in the manifest file.

Here is an example application manifest file.

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="Application2Type" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
   <Parameters>
      <Parameter Name="Actor1ActorService_PartitionCount" DefaultValue="10" />
      <Parameter Name="Actor1ActorService_MinReplicaSetSize" DefaultValue="2" />
      <Parameter Name="Actor1ActorService_TargetReplicaSetSize" DefaultValue="3" />
   </Parameters>
   <ServiceManifestImport>
      <ServiceManifestRef ServiceManifestName="Actor1Pkg" ServiceManifestVersion="1.0.0" />
      <ConfigOverrides />
   </ServiceManifestImport>
   <DefaultServices>
      <Service Name="Actor1ActorService">
         <StatefulService ServiceTypeName="Actor1ActorServiceType" TargetReplicaSetSize="[Actor1ActorService_TargetReplicaSetSize]" MinReplicaSetSize="[Actor1ActorService_MinReplicaSetSize]">
            <UniformInt64Partition PartitionCount="[Actor1ActorService_PartitionCount]" LowKey="-9223372036854775808" HighKey="9223372036854775807" />
         </StatefulService>
      </Service>
   </DefaultServices>
</ApplicationManifest>
```

## Publish an application to a Service Fabric cluster using the Publish Service Fabric Application dialog box

The following steps demonstrate how to publish an application by using use the **Publish Service Fabric Application** dialog provided by the Visual Studio Service Fabric Tools.

1. On the shortcut menu of the Service Fabric Application project, choose **Publish…** to view the **Publish Service Fabric Application** dialog box.

    ![][0]

    The file selected in the **Target profile** dropdown list box is where all of the settings, except **Manifest versions**, are saved. You can either reuse an existing profile or create a new one by choosing **<Manage Profiles…>** in the **Target profile** dropdown list box. When you choose a publish profile, its contents appear in the corresponding fields of the dialog. To save your changes at any time, choose the **Save Profile** link.    

1. The **Connection endpoint** section lets you specify a local or remote Service Fabric cluster’s publishing endpoint. To add or change the connection endpoint, choose the **Select…** button. The **Select Service Fabric Cluster** dialog box shows the available Service Fabric cluster connection endpoints to which you can publish. (If you're not already logged into an Azure subscription, you'll be prompted to do so.) Choose a connection endpoint.

    ![][1]

    Once you choose an endpoint, Visual Studio validates the connection to the selected Service Fabric cluster. If the cluster isn't secure, Visual Studio can connect to it immediately. However, if the cluster is secure, you'll need to install a certificate on your local machine before proceeding. See [How to configure secure connections](service-fabric-visualstudio-configure-secure-connections.md) for more information. When you're done, choose the **OK** button. The selected cluster appears in the **Publish Service Fabric Application** dialog.

1. The **Application Parameters File** dropdown list box lets you navigate to an application parameters file. An application parameters file holds user-specified values for parameters in the application manifest file. To add or change a parameter, choose the **Edit** button. Enter or change the parameter's value in the **Parameters** grid. When you're done, choose the **Save** button.

    ![][2]

1. The **Upgrade the Application** checkbox lets you specify whether this publish action is an upgrade. Upgrade publish actions differ from normal publish actions. See [Service Fabric Application Upgrade](service-fabric-application-upgrade.md) for a list of differences. To configure upgrade settings, choose the **Configure Upgrade Settings** link. The upgrade parameter editor appears. See [Configure the upgrade of a Service Fabric application](service-fabric-visualstudio-configure-upgrade.md) to learn more about upgrade parameters.

1. Choose the **Manifest Versions…** button to view the **Edit Versions** dialog. You need to update application and service versions for an upgrade to take place. See [Service Fabric Application Upgrade Tutorial](service-fabric-application-upgrade-tutorial.md) to learn how application and service manifest versions impact an upgrade process.

    ![][3]

    If the application and service versions use semantic versioning such as 1.0.0 or numerical values in the format of 1.0.0.0, select the **Automatically update application and service versions** option. When you choose this option, the service and application version numbers are automatically updated whenever a code, config, or data package version is updated. If you prefer to edit the versions manually, clear the checkbox to disable this feature.

    >[AZURE.NOTE] For all package entries to appear for an Actor project, first build the project to generate the entries in the Service Manifest files.

1. When you're done specifying all of the necessary settings, choose the **Publish** button to publish your application to the selected Service Fabric cluster. The settings you specified are applied to the publish process.

## Next steps

To learn how to automate the publishing process in a Continuous Integration environment, see [Service Fabric Set Up Continuous Integration](service-fabric-set-up-continuous-integration.md).


[0]: ./media/service-fabric-publish-app-remote-cluster/PublishDialog.png
[1]: ./media/service-fabric-publish-app-remote-cluster/SelectCluster.png
[2]: ./media/service-fabric-publish-app-remote-cluster/EditParams.png
[3]: ./media/service-fabric-publish-app-remote-cluster/EditVersions.png
