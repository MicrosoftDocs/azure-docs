---
 title: include file
 description: include file
 services: virtual-network-manager
 author: mbender
 ms.service: virtual-network-manager
 ms.topic: include
 ms.date: 06/04/2024
 ms.author: mbender-ms
ms.custom: include-file
---
## Create a connectivity configuration

In this task, you create a connectivity configuration that includes your network group and a routing rule collection. You can choose to enable [direct connectivity](../articles/virtual-network-manager/concept-connectivity-configuration.md#direct-connectivity) in the hub and spoke topology, or leave all communication to go through the hub virtual network and Azure firewall.

1. In the network manager instance, select **Configurations** under **Settings** then select **Create connectivity configuration**.
2. In the **Create a connectivity configuration** window, enter the connectivity configuration **Name** and **Description** on the **Basics** tab then select **Next: Topology >**.
3. On the **Topology** tab, enter or select the following settings:

    | **Setting** | **Value** |
    |---|---|
    | **Topology** | Select **Hub and spoke**. |
    | **Hub** | Choose **Select a hub**.</br>On the **Select a hub** page, choose your hub virtual network then select **Select**. |
    | **Spoke network groups** | Choose **+ Add**>**Add network groups**.</br>On the **Add network groups** page, choose your network group then choose **Select**. |
4. From the list of **Spoke network groups**, you can choose to enable **Direct connectivity** or **Global mesh**. Direct connectivity allows spoke virtual networks to communicate directly with each other. Global mesh allows all virtual networks to communicate with each other. Leaving these unchecked results in all spoke virtual networks communicating through the hub virtual network and Azure firewall.

    > [!IMPORTANT]
    > If you enable direct connectivity, you must have a routing configuration with direct routing within the virtual network. If you enable global mesh, you must have a routing configuration with global mesh enabled.
   
   :::image type="content" source="media/virtual-network-manager-deploy-hub-spoke-topology/create-direct-connectivity-hub-spoke-configuration.png" alt-text="Screenshot of Create a connectivity configuration for hub and spoke with direct connectivity.":::

5. Choose **Next: Visualization >** to review the connectivity configuration then select **Review + create** > **Create**.

## Deploy connectivity configuration

In this task, you deploy the connectivity configuration to create the hub and spoke topology.

1. In the network manager instance, select **Configurations** under **Settings** then select the connectivity configuration you created.
2. From the task bar, select **Deploy**.
3. In the **Deploy a configuration** window, select the connectivity configuration you created, and select the **Target Regions** you wish to deploy the configuration to.

    > [!IMPORTANT]
    > The hub and spoke topology is created in the selected regions. Make sure to select the regions where your hub and spoke virtual networks are deployed.

4. Select **Next** or the **Review + deploy** tab then select **Deploy**.
5. Select **Deployments** under **Settings**, and verify your deployment was successful.

