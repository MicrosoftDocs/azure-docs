---
title: How to parameterize configuration files in Azure Service Fabric | Microsoft Docs
description: Shows you how to parameterize configuration files in Service Fabric
documentationcenter: .net
author: mikkelhegn
manager: msfussell
editor: ''

ms.service: service-fabric

ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA

ms.workload: NA
ms.date: 12/06/2017
ms.author: mikhegn

---
# How to parameterize configuration files in Service Fabric

This article shows you how to parameterize a configuration file in Service Fabric.

## Procedure for parameterizing configuration files

In this example, you override a configuration value using parameters in your application deployment.

1. Open the Config\Settings.xml file.
1. Set a configuration parameter, by adding the following XML:

    ```xml
      <Section Name="MyConfigSection">
        <Parameter Name="CacheSize" Value="25" />
      </Section>
    ```

1. Save and close the file.
1. Open the `ApplicationManifest.xml` file.
1. Add a  `ConfigOverride` element, referencing the configuration package, the section, and the parameter.

      ```xml
        <ConfigOverrides>
          <ConfigOverride Name="Config">
              <Settings>
                <Section Name="MyConfigSection">
                    <Parameter Name="CacheSize" Value="[Stateless1_CacheSize]" />
                </Section>
              </Settings>
          </ConfigOverride>
        </ConfigOverrides>
      ```

1. Still in the ApplicationManifest.xml file, you then specify the parameter in the `Parameters` element

    ```xml
      <Parameters>
        <Parameter Name="Stateless1_CacheSize" />
      </Parameters>
    ```

1. And define a `DefaultValue`

    ```xml
      <Parameters>
        <Parameter Name="Stateless1_CacheSize" DefaultValue="80" />
      </Parameters>
    ```

> [!NOTE]
> In the case where you add a ConfigOverride, Service Fabric always chooses the application parameters or the default value specified in the application manifest.
>
>

## Next steps
To learn more about some of the core concepts that are discussed in this article, see the [Manage applications for multiple environments articles](service-fabric-manage-multiple-environment-app-configuration.md).

For information about other app management capabilities that are available in Visual Studio, see [Manage your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).