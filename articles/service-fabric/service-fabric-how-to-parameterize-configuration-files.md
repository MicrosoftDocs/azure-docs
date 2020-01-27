---
title: Parameterize config files in Azure Service Fabric 
description: Learn how to parameterize configuration files in Service Fabric, a useful technique when managing multiple environments.
author: mikkelhegn

ms.topic: conceptual
ms.date: 10/09/2018
ms.author: mikhegn
---
# How to parameterize configuration files in Service Fabric

This article shows you how to parameterize a configuration file in Service Fabric.  If you're not already familiar with the core concepts of managing applications for multiple environments, read [Manage applications for multiple environments](service-fabric-manage-multiple-environment-app-configuration.md).

## Procedure for parameterizing configuration files

In this example, you override a configuration value using parameters in your application deployment.

1. Open the *\<MyService>\PackageRoot\Config\Settings.xml* file in your service project.
1. Set a configuration parameter name and value, for example cache size equal to 25, by adding the following XML:

   ```xml
    <Section Name="MyConfigSection">
      <Parameter Name="CacheSize" Value="25" />
    </Section>
   ```

1. Save and close the file.
1. Open the *\<MyApplication>\ApplicationPackageRoot\ApplicationManifest.xml* file.
1. In the ApplicationManifest.xml file, declare a parameter and default value in the `Parameters` element.  It's recommended that the parameter name contains the name of the service (for example, "MyService").

   ```xml
    <Parameters>
      <Parameter Name="MyService_CacheSize" DefaultValue="80" />
    </Parameters>
   ```
1. In the `ServiceManifestImport` section of the ApplicationManifest.xml file, add a `ConfigOverrides` and `ConfigOverride` element, referencing the configuration package, the section, and the parameter.

   ```xml
    <ConfigOverrides>
      <ConfigOverride Name="Config">
          <Settings>
            <Section Name="MyConfigSection">
                <Parameter Name="CacheSize" Value="[MyService_CacheSize]" />
            </Section>
          </Settings>
      </ConfigOverride>
    </ConfigOverrides>
   ```

> [!NOTE]
> In the case where you add a ConfigOverride, Service Fabric always chooses the application parameters or the default value specified in the application manifest.
>
>

## Next steps
For information about other app management capabilities that are available in Visual Studio, see [Manage your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
