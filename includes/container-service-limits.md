| Resource | Default Limit |
| --- | :--- |
| Max nodes per cluster | 100 |
| Max pods per node ([basic networking with Kubenet][basic-networking]) | 110 |
| Max pods per node ([advanced networking with Azure CNI][advanced-networking]) | 30<sup>1</sup> |
| Max cluster per subscription | 100 |

<sup>1</sup> This value can be customized through ARM template deployment. See examples [here][arm-deployment-example].<br />

<!-- LINKS - Internal -->
[basic-networking]: ../articles/aks/networking-overview.md#basic-networking
[advanced-networking]: ../articles/aks/networking-overview.md#advanced-networking

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
[arm-deployment-example]: https://github.com/Azure/AKS/blob/master/examples/vnet/02-aks-custom-vnet.json#L64-L69
