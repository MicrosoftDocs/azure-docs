# [Azure Network Watcher Documentation](index.md)

# Overview
## [About Network Watcher](network-watcher-monitoring-overview.md)

# Get Started
## [Diagnose VM traffic filter problem - Portal](diagnose-vm-network-traffic-filtering-problem.md)
## [Diagnose VM traffic filter problem - PowerShell](diagnose-vm-network-traffic-filtering-problem.md)
## [Diagnose VM traffic filter problem - Azure CLI](diagnose-vm-network-traffic-filtering-problem-cli.md)

# Tutorials
## [Diagnose VM routing problem - Portal](diagnose-vm-network-routing-problem.md)
## [Diagnose VM routing problem - PowerShell](diagnose-vm-network-routing-problem-powershell.md)
## [Diagnose VM routing problem - Azure CLI](diagnose-vm-network-routing-problem-cli.md)

# Concepts
## [Diagnose VM network traffic filter problems](network-watcher-ip-flow-verify-overview.md)
## [Diagnose VM routing problems](network-watcher-next-hop-overview.md)
## [Diagnose outbound VM communication problems](network-watcher-connectivity-overview.md)
## [Troubleshoot VPN connectivity problems](network-watcher-troubleshoot-overview.md)
## [Variable packet capture](network-watcher-packet-capture-overview.md)
## [Network security group flow logging](network-watcher-nsg-flow-logging-overview.md)
## [Network security group view](network-watcher-security-group-view-overview.md)
## [View network topology](network-watcher-topology-overview.md)

# How-to guides
## [Configure Network Watcher](network-watcher-create.md)
## [Monitor network connections](connection-monitor.md)

## Diagnose VM network problems
### Install VM extension
#### [Windows](../virtual-machines/windows/extensions-nwa.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json)
#### [Linux](../virtual-machines/linux/extensions-nwa.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json)
### Diagnose outbound connections
#### [Azure portal](network-watcher-connectivity-portal.md)
#### [Azure PowerShell](network-watcher-connectivity-powershell.md)
#### [Azure CLI](network-watcher-connectivity-cli.md)
#### [REST](network-watcher-connectivity-rest.md)
### Capture and analyze packets
#### Manage a packet capture
##### [Azure portal](network-watcher-packet-capture-manage-portal.md)
##### [Azure PowerShell](network-watcher-packet-capture-manage-powershell.md)
##### [Azure CLI 1.0](network-watcher-packet-capture-manage-cli-nodejs.md)
##### [Azure CLI](network-watcher-packet-capture-manage-cli.md)
##### [REST](network-watcher-packet-capture-manage-rest.md)
#### Analyze a packet capture
##### [Find anomalies](network-watcher-deep-packet-inspection.md)
##### [Proactive network monitoring with Azure Functions](network-watcher-alert-triggered-packet-capture.md)
##### [Perform intrusion detection using open source tools](network-watcher-intrusion-detection-open-source-tools.md)
##### [Visualize network traffic patterns using open source tools](network-watcher-using-open-source-tools.md)

## Work with network security group logs
### Configure NSG flow logs
#### [Azure portal](network-watcher-nsg-flow-logging-portal.md)
#### [Azure PowerShell](network-watcher-nsg-flow-logging-powershell.md)
#### [Azure CLI 1.0](network-watcher-nsg-flow-logging-cli-nodejs.md)
#### [Azure CLI](network-watcher-nsg-flow-logging-cli.md)
#### [REST](network-watcher-nsg-flow-logging-rest.md)
### [Perform compliance and audit on your network using PowerShell](network-watcher-nsg-auditing-powershell.md)
### Analyze NSG flow logs
#### [Read NSG flow logs](network-watcher-read-nsg-flow-logs.md)
#### Use traffic analytics
##### [Analyze with traffic analytics](traffic-analytics.md)
##### [Frequently asked questions](traffic-analytics-faq.md)
#### [Use Power BI](network-watcher-visualize-nsg-flow-logs-power-bi.md)
#### [Use Elastic Stack](network-watcher-visualize-nsg-flow-logs-open-source-tools.md)
#### [Use Grafana](network-watcher-nsg-grafana.md)
#### [Use Graylog](network-watcher-analyze-nsg-flow-logs-graylog.md)
### View network security groups
#### [Azure PowerShell](network-watcher-security-group-view-powershell.md)
#### [Azure CLI 1.0](network-watcher-security-group-view-cli-nodejs.md)
#### [Azure CLI](network-watcher-security-group-view-cli.md)
#### [REST](network-watcher-security-group-view-rest.md)
## Diagnose VPN gateway and connections
### Troubleshoot
#### [Azure portal](network-watcher-troubleshoot-manage-portal.md)
#### [Azure PowerShell](network-watcher-troubleshoot-manage-powershell.md)
#### [Azure CLI 1.0](network-watcher-troubleshoot-manage-cli-nodejs.md)
#### [Azure CLI](network-watcher-troubleshoot-manage-cli.md)
#### [REST](network-watcher-troubleshoot-manage-rest.md)
### [Monitor VPN gateway with Azure Automation](network-watcher-monitor-with-azure-automation.md)
### [Diagnose on-premises connectivity via VPN gateway](network-watcher-diagnose-on-premises-connectivity.md)
## View your network topology
### [Azure PowerShell](network-watcher-topology-powershell.md)
### [Azure CLI 1.0](network-watcher-topology-cli-nodejs.md)
### [Azure CLI](network-watcher-topology-cli.md)
### [REST](network-watcher-topology-rest.md)
## [Determine relative latency between a location and Azure region](view-relative-latencies.md)

# Reference
## [Azure CLI](/cli/azure/network/watcher)
## [Azure PowerShell](/powershell/module/azurerm.network/#network_watcher)
## [Java](/java/api/com.microsoft.azure.management.network)
## [Ruby](http://www.rubydoc.info/gems/azure_mgmt_network/Azure/Network/Mgmt/V2016_09_01/Models/NetworkWatcher) 
## [Python](http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.mgmt.network.html#azure.mgmt.network.NetworkManagementClient.network_watchers)

## [.NET](/dotnet/api)
## [REST](/rest/api/networkwatcher/)
# Related
## [Virtual network](/azure/virtual-network/)
## [Virtual machines](/azure/virtual-machines/)
## [VPN gateway](/azure/vpn-gateway/)

# Resources
## [Azure Roadmap](https://azure.microsoft.com/roadmap/)
## [MSDN forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=WAVirtualMachinesVirtualNetwork)
## [Pricing](https://azure.microsoft.com/pricing/details/network-watcher/)
## [Service updates](https://azure.microsoft.com/updates/?product=network-watcher)
## [SLA](https://azure.microsoft.com/support/legal/sla/)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/network-watcher)
