## VPN Gateway 
A VPN gateway resource enables you to create a secure connection between their on-premises data center and Azure. A VPN gateway resource can be configured in three different ways:
 
- **Point to Site** – you can securely access your Azure resources hosted in a VNET by using a VPN client from any computer. 
- **Multi-site connection** – you can securely connect from your on-premises data centers to resources running in a VNET. 
- **VNET to VNET** – you can securely connect across Azure VNETS within the same region, or across regions to build workloads with geo-redundancy.

Key properties of a VPN gateway include:
 
- **Gateway type** - dynamically routed or a static routed gateway. 
- **VPN Client Address Pool Prefix** – IP addresses to be assigned to clients connecting in a point to site configuration.