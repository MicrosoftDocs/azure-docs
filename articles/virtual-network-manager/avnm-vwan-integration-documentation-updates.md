# 1) AVNM concept page: Connectivity configurations — “Hub-and-spoke topology” update + new subsection

**Page:** [Connectivity configurations in Azure Virtual Network Manager](https://learn.microsoft.com/en-us/azure/virtual-network-manager/concept-connectivity-configuration)  
**Place to update:** In the **Hub-and-spoke topology** section, right after the first explanation of hub/spoke behavior.

**1A) Replacement paragraph (swap into the Hub-and-spoke intro)**

In a hub-and-spoke topology, connectivity is established between a selected hub and the spoke virtual networks that are members of one or more selected spoke network groups. The hub is bi-directionally connected with each spoke virtual network member in the selected network groups.

The hub can be either:

\- a **hub virtual network** (where connectivity is created using virtual network peering), or

\- an **Azure Virtual WAN hub** (where connectivity is created and managed as Virtual WAN virtual network connections, and routing configuration is applied through a Virtual WAN connection policy).

**1B) New subsection to add (insert below “Hub-and-spoke topology”)**

\### Using an Azure Virtual WAN hub as the hub

When you select an Azure Virtual WAN hub as the hub in an Azure Virtual Network Manager (AVNM) hub-and-spoke connectivity configuration, AVNM can connect the virtual networks in the selected spoke network groups to the Virtual WAN hub. AVNM applies the selected Virtual WAN routing configuration through a **Virtual WAN connection policy**.

To use this experience in the Azure portal, create a hub-and-spoke connectivity configuration and select a Virtual WAN hub as the hub. Then select or create a Virtual WAN connection policy and add your spoke network groups. Deploy the configuration to apply the changes.

# 2) AVNM how‑to: Create a hub-and-spoke topology — add full “Virtual WAN hub” path

**Page location:** The AVNM landing page lists a hub‑and‑spoke how‑to (“Create a hub-and-spoke topology”).  
**Place to update:** Inside that how‑to, add a new section titled **“Use a Virtual WAN hub as the hub”**.

**New section to insert into the how‑to**

\## Use a Virtual WAN hub as the hub (AVNM + vWAN integration)

This section shows how to create an Azure Virtual Network Manager (AVNM) hub-and-spoke connectivity configuration where the hub is an **Azure Virtual WAN hub**.

\### Prerequisites

\- An existing Azure Virtual Network Manager instance and at least one network group.

\- An existing Azure Virtual WAN and a Virtual WAN hub.

\- Appropriate permissions to create or update connectivity configurations and to create or select Virtual WAN connection policies.

\### Create the connectivity configuration

1\. In the Azure portal, go to your **Network manager**.

2\. Select **Configurations** and then select **Create** \> **Connectivity configuration**.

3\. On the **Basics** tab, enter a name and description, then select **Next: Topology**.

\### Select the Virtual WAN hub

4\. On the **Topology** tab, select **Hub and spoke**, and then select **Select a hub**.

5\. In the hub selection pane, choose your **Virtual WAN hub**.

\### Select or create a Virtual WAN connection policy

6\. **Select a connection policy**.

7\. Choose an existing connection policy, or select **Create new** to create a connection policy that will be applied to the Virtual WAN virtual network connections created or updated by this connectivity configuration.

A connection policy stores Virtual WAN routing configuration settings such as route table propagation and association, route maps, and default route propagation.

\### Add spoke network groups

8\. Select **Add** and choose one or more AVNM network groups to use as spoke groups.

   - For the virtual networks in the selected network groups, AVNM creates Virtual WAN **virtual network connections** to the hub when needed.

   - If a virtual network is already connected to the hub, AVNM updates the existing connection to reference the selected connection policy.

\### Create and deploy the configuration

9\. Select **Review + create**, then select **Create**.

10\. Open the created connectivity configuration and select **Deploy** to apply it.

\### Validate the deployment

\- In your **Virtual WAN** resource, go to **Virtual network connections** and confirm the relevant connections show as successfully provisioned and connected.

\- In the **Virtual hub** resource, review **Effective routes** and confirm routes reflect the newly created or updated virtual network connections.

# 3) vWAN “landing page” (Microsoft Learn): add a Scenario entry for AVNM at-scale onboarding

**Page:** [Virtual WAN documentation](https://learn.microsoft.com/en-us/azure/virtual-wan/)

**New scenario entry (add to the list)**

\### Scenario - Connect spoke VNets to a Virtual WAN hub at scale using Azure Virtual Network Manager

Use Azure Virtual Network Manager (AVNM) network groups and connectivity configurations to connect many virtual networks to a Virtual WAN hub and apply routing configuration consistently through a Virtual WAN connection policy. This is useful when you want policy-based onboarding (dynamic membership) and centralized, repeatable configuration across a large number of spokes.

See: <https://learn.microsoft.com/en-us/azure/virtual-network-manager/concept-connectivity-configuration>

See: **(link to the AVNM how-to section you publish)**

# 4) vWAN Overview page: add a cross-service bullet under “main features” (or “Automated spoke setup”)

**Page:** [Azure Virtual WAN Overview](https://learn.microsoft.com/en-us/azure/virtual-wan/virtual-wan-about)

**New bullet content (insert)**

\- **At-scale spoke onboarding with Azure Virtual Network Manager (AVNM):** 

  If you want to connect and manage many VNets as spokes of a Virtual WAN hub using group-based selection and policy-driven membership, you can use Azure Virtual Network Manager connectivity configurations with a Virtual WAN hub as the hub. AVNM can create or update Virtual WAN virtual network connections for VNets in selected network groups and apply routing configuration through a connection policy.
