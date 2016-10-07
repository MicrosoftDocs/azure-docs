When you create a virtual network gateway, you need to specify the gateway SKU that you want to use. When you select a higher gateway SKU, more CPUs and network bandwidth are allocated to the gateway, and as a result, the gateway can support higher network throughput to the virtual network.

VPN Gateway can use the following SKUs:

- Basic
- Standard
- HighPerformance

When selecting a SKU, consider the following limitations:

- If you want to use a PolicyBased VPN type, you must use the Basic gateway SKU. PolicyBased VPNs (previously called Static Routing) are not supported on any other SKU.
- BGP is not supported on the Basic SKU.
- ExpressRoute-VPN Gateway coexist configurations are not supported on the Basic SKU.
