---
title: Azure Service Fabric set up reverse proxy | Microsoft Docs
description: Understand how to set up and configure Service Fabric's reverse proxy.
services: service-fabric
documentationcenter: na
author: jimacoMS2
manager: timlt
editor: 

ms.assetid: 
ms.service: service-fabric
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: required
ms.date: 07/27/201
ms.author: v-jamebr

---
# Set up and configure reverse proxy in Azure Service Fabric
Reverse proxy is an optional Azure Service Fabric service that helps microservices running in a Service Fabric cluster discover and communicate with other services that have http endpoints. This article shows you how to set up reverse proxy in your cluster.

## Enable reverse proxy using Azure portal

Azure portal provides an option to enable reverse proxy when you create a new Service Fabric cluster. You can't upgrade an existing cluster to use reverse proxy through the portal. 

To configure reverse proxy when you create a cluster using Azure portal, do the following:

 - In **Step 2: Cluster Configuration**, under **Node type configuration**, select **Enable reverse proxy**.

   ![Enable reverse proxy on portal](./media/service-fabric-reverseproxy-setup/enable-rp-portal.png)
 - (Optional) To configure secure reverse proxy, you need to configure an SSL certificate. In **Step 3: Security**, on **Configure cluster security settings**, under **Configuration type**, select **Custom**. Then, under **Reverse Proxy SSL certificate**, select **Include a SSL certificate for reverse proxy** and enter your certificate details.

   ![Configure secure reverse proxy on portal](./media/service-fabric-reverseproxy-setup/configure-rp-certificate-portal.png)

If you choose not to configure the reverse proxy with a certificate when you create the cluster, you can do so later through the Resource Manager template for the cluster's resource group. To learn more, see [Enable reverse proxy via Azure Resource Manager templates](#enable-reverse-proxy-via-azure-resource-manager-templates).

### Make the reverse proxy public
To address the reverse proxy from outside the Azure cluster, set up Azure Load Balancer rules for the reverse proxy port. These steps can be performed at any time after you have created the cluster.

1. On the Azure portal, click the resource group for your cluster, then click the load balancer for your cluster.
2. To add a health Probe for the reverse proxy port, in the left pane of the load balancer window, under **SETTINGS**, click **Health probes**. Then click **Add** at the top of the Health probes window and enter details for the reverse proxy port, then click **OK**. By defaunlt, the reverse proxy port is 19081, unless you changed it when you created the cluster.

   ![Configure reverse proxy health probe](./media/service-fabric-reverseproxy-setup/lb-rp-probe.png)
3. To add a Load Balancer rule to expose the reverse proxy port, in the left pane of the load balancer window, under **SETTINGS**, click **Load balancing rules**. Then click **Add** at the top of the Load balancing rules window and enter details for the reverse proxy port. Make sure you set the **Port** value to the port you want the reverse proxy exposed on, the **Backend port** value to the port you set when you enabled reverse proxy, and the **Health probe** value to the health probe you configured in the previous step. Set other fields as appropriate and click **OK**.

   ![Configure load balancer rule for reverse proxy](./media/service-fabric-reverseproxy-setup/lb-rp-rule.png)



## Enable reverse proxy via Azure Resource Manager templates

For clusters on Azure, you can use the [Azure Resource Manager template](service-fabric-cluster-creation-via-arm.md) to enable the reverse proxy in Service Fabric. You can enable reverse proxy when you create the cluster or update the cluster at a later time. 

You can find Resource Manager templates that can help you configure secure reverse proxy for an Azure cluster in the [Secure Reverse Proxy Sample Templates](https://github.com/ChackDan/Service-Fabric/tree/master/ARM%20Templates/ReverseProxySecureSample) on GitHub. Refer to [Configure HTTPS Reverse Proxy in a secure cluster](https://github.com/ChackDan/Service-Fabric/tree/master/ARM%20Templates/ReverseProxySecureSample/README.md#configure-https-reverse-proxy-in-a-secure-cluster) in the README file for instructions and templates to configure secure reverse proxy with a certificate and handling certificate rollover.

First, you need a Resource Manager template for the cluster that you want to deploy. For a new cluster, you can either use the sample templates or create a custom Resource Manager template. For an existing cluster, you can export the Resource Manager template for the cluster's resource group using the [Azure portal](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-export-template#export-the-template-from-resource-group), [PowerShell](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-export-template-powershell#export-resource-group-as-template), or the [Azure CLI](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-export-template-cli#export-resource-group-as-template).

After you have a Resource Manager template, you can enable the reverse proxy with the following steps:

1. Define a port for the reverse proxy in the [Parameters section](../azure-resource-manager/resource-group-authoring-templates.md) of the template.

    ```json
    "SFReverseProxyPort": {
        "type": "int",
        "defaultValue": 19081,
        "metadata": {
            "description": "Endpoint for Service Fabric Reverse proxy"
        }
    },
    ```
2. Specify the port for each of the nodetype objects in the **Cluster** [Resource type section](../azure-resource-manager/resource-group-authoring-templates.md).

    The port is identified by the parameter name, reverseProxyEndpointPort.

    ```json
    {
        "apiVersion": "2016-09-01",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        ...
       "nodeTypes": [
          {
           ...
           "reverseProxyEndpointPort": "[parameters('SFReverseProxyPort')]",
           ...
          },
        ...
        ],
        ...
    }
    ```
3. (Optional) To address the reverse proxy from outside the Azure cluster, set up the Azure Load Balancer rules for the port that you specified in step 1.

    ```json
    {
        "apiVersion": "[variables('lbApiVersion')]",
        "type": "Microsoft.Network/loadBalancers",
        ...
        ...
        "loadBalancingRules": [
            ...
            {
                "name": "LBSFReverseProxyRule",
                "properties": {
                    "backendAddressPool": {
                        "id": "[variables('lbPoolID0')]"
                    },
                    "backendPort": "[parameters('SFReverseProxyPort')]",
                    "enableFloatingIP": "false",
                    "frontendIPConfiguration": {
                        "id": "[variables('lbIPConfig0')]"
                    },
                    "frontendPort": "[parameters('SFReverseProxyPort')]",
                    "idleTimeoutInMinutes": "5",
                    "probe": {
                        "id": "[concat(variables('lbID0'),'/probes/SFReverseProxyProbe')]"
                    },
                    "protocol": "tcp"
                }
            }
        ],
        "probes": [
            ...
            {
                "name": "SFReverseProxyProbe",
                "properties": {
                    "intervalInSeconds": 5,
                    "numberOfProbes": 2,
                    "port":     "[parameters('SFReverseProxyPort')]",
                    "protocol": "tcp"
                }
            }  
        ]
    }
    ```
4. To configure SSL certificates on the port for the reverse proxy, add the certificate to the ***reverseProxyCertificate*** property in the **Cluster** [Resource type section](../resource-group-authoring-templates.md).

    ```json
    {
        "apiVersion": "2016-09-01",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        "dependsOn": [
            "[concat('Microsoft.Storage/storageAccounts/', parameters('supportLogStorageAccountName'))]"
        ],
        "properties": {
            ...
            "reverseProxyCertificate": {
                "thumbprint": "[parameters('sfReverseProxyCertificateThumbprint')]",
                "x509StoreName": "[parameters('sfReverseProxyCertificateStoreName')]"
            },
            ...
            "clusterState": "Default",
        }
    }
    ```

### Supporting a reverse proxy certificate that's different from the cluster certificate
 If the reverse proxy certificate is different from the certificate that secures the cluster, then the previously specified certificate should be installed on the virtual machine and added to the access control list (ACL) so that Service Fabric can access it. This can be done in the **virtualMachineScaleSets** [Resource type section](../resource-group-authoring-templates.md). For installation, add the certificate to the osProfile. The extension section of the template can update the certificate in the ACL.

  ```json
  {
    "apiVersion": "[variables('vmssApiVersion')]",
    "type": "Microsoft.Compute/virtualMachineScaleSets",
    ....
      "osProfile": {
          "adminPassword": "[parameters('adminPassword')]",
          "adminUsername": "[parameters('adminUsername')]",
          "computernamePrefix": "[parameters('vmNodeType0Name')]",
          "secrets": [
            {
              "sourceVault": {
                "id": "[parameters('sfReverseProxySourceVaultValue')]"
              },
              "vaultCertificates": [
                {
                  "certificateStore": "[parameters('sfReverseProxyCertificateStoreValue')]",
                  "certificateUrl": "[parameters('sfReverseProxyCertificateUrlValue')]"
                }
              ]
            }
          ]
        }
   ....
   "extensions": [
          {
              "name": "[concat(parameters('vmNodeType0Name'),'_ServiceFabricNode')]",
              "properties": {
                      "type": "ServiceFabricNode",
                      "autoUpgradeMinorVersion": false,
                      ...
                      "publisher": "Microsoft.Azure.ServiceFabric",
                      "settings": {
                        "clusterEndpoint": "[reference(parameters('clusterName')).clusterEndpoint]",
                        "nodeTypeRef": "[parameters('vmNodeType0Name')]",
                        "dataPath": "D:\\\\SvcFab",
                        "durabilityLevel": "Bronze",
                        "testExtension": true,
                        "reverseProxyCertificate": {
                          "thumbprint": "[parameters('sfReverseProxyCertificateThumbprint')]",
                          "x509StoreName": "[parameters('sfReverseProxyCertificateStoreValue')]"
                        },
                  },
                  "typeHandlerVersion": "1.0"
              }
          },
      ]
    }
  ```
> [!NOTE]
> When you use certificates that are different from the cluster certificate to enable the reverse proxy on an existing cluster, install the reverse proxy certificate and update the ACL on the cluster before you enable the reverse proxy. Complete the [Azure Resource Manager template](service-fabric-cluster-creation-via-arm.md) deployment by using the settings mentioned previously before you start a deployment to enable the reverse proxy in steps 1-4.

## Enable reverse proxy on standalone clusters

You enable reverse proxy for standalone clusters through the ClusterConfig.json file. You can enable reverse proxy at cluster creation or by upgrading the configuration for an existing cluster. To learn more about the settings available in ClusterConfig.json files, see [Standalone cluster settings](./service-fabric-cluster-manifest.md).

The following steps show you the settings to use to enable reverse proxy and, optionally, to secure the reverse proxy with an X.509 certificate. 

1. To enable reverse proxy, set the **reverseProxyEndpointPort** value for the node type under **properties** in the cluster config. The following JSON shows setting the reverse proxy endpoint port to 19081 for nodes with a type of "NodeType0":

   ```json
       "properties": {
          ... 
           "nodeTypes": [
               {
                   "name": "NodeType0",
                   ...
                   "reverseProxyEndpointPort": "19081",
                   ...
               }
           ],
          ...
       }
   ```
2. (Optional) For a secure reverse proxy, configure a certificate in the **security** section under **properties**. 
   - For a development or test environment, you can use the **ReverseProxyCertificate** setting:

      ```json
          "properties": {
              ...
              "security": {
                  ...
                  "CertificateInformation": {
                      ...
                      "ReverseProxyCertificate": {
                          "Thumbprint": "[Thumbprint]",
                          "ThumbprintSecondary": "[Thumbprint]",
                          "X509StoreName": "My"
                      },
                      ...
                  }
              },
              ...
          }
      ```
   - For a production, the **ReverseProxyCertificateCommonNames** setting is recommended:

      ```json
          "properties": {
              ...
              "security": {
                  ...
                  "CertificateInformation": {
                      ...
                      "ReverseProxyCertificateCommonNames": {
                        "CommonNames": [
                            {
                              "CertificateCommonName": "[CertificateCommonName]"
                            }
                          ],
                          "X509StoreName": "My"
                      },
                      ...
                  }
              },
              ...
          }
      ```

   To learn more about configuring and managing certificates for a standalone cluster, as well as more detail about configuring certificates used to secure reverse proxy, see [X509 certificate-based security](./service-fabric-windows-cluster-x509-security.nd).

After you've modified your ClusterConfig.json file to enable reverse proxy, follow the instructions in [Upgrade the cluster configuration](./service-fabric-cluster-upgrade-windows-server.md#upgrade-the-cluster-configuration) to push the changes to your cluster.

## Customize reverse proxy behavior using fabric settings

You can customize the behavior of reverse proxy through fabric settings in the Resource Manager template for clusters hosted in Azure or in the ClusterConfig.json file for standalone clusters. Settings that control reverse proxy behavior are located in the [**ApplicationGateway/Http**](./service-fabric-cluster-fabric-settings.md#applicationgatewayhttp) section in the **fabricSettings** section under the cluster **properties** section. 

For example, you can set the value of **DefaultHttpRequestTimeout** to set the timeout for requests to the reverse proxy to 180 seconds as in the following JSON:

   ```json
   {
   "fabricSettings": [
             ...
             {
               "name": "ApplicationGateway/Http",
               "parameters": [
                 {
                   "name": "DefaultHttpRequestTimeout",
                   "value": "180"
                 }
               ]
             }
           ],
           ...
   }
   ```
 



## Next steps
* See an example of HTTP communication between services in a [sample project on GitHub](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started).
* [Forwarding to secure HTTP service with the reverse proxy](service-fabric-reverseproxy-configure-secure-communication.md)
* [Remote procedure calls with Reliable Services remoting](service-fabric-reliable-services-communication-remoting.md)
* [Web API that uses OWIN in Reliable Services](service-fabric-reliable-services-communication-webapi.md)
* [WCF communication by using Reliable Services](service-fabric-reliable-services-communication-wcf.md)
* For additional reverse proxy configuration options, refer ApplicationGateway/Http section in [Customize Service Fabric cluster settings](service-fabric-cluster-fabric-settings.md).

[0]: ./media/service-fabric-reverseproxy/external-communication.png
[1]: ./media/service-fabric-reverseproxy/internal-communication.png
