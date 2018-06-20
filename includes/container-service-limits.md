| Resource | Default Limit |
| --- | :--- |
| Max nodes per cluster | 100 |
| Max pods per node ([basic networking with Kubenet][basic-networking]) | 110 |
| Max pods per node ([advanced networking with Azure CNI][advanced-networking]) | 30 |
| Max cluster per subscription | 20<sup>1</sup> |

<sup>1</sup> Create an [Azure support request][azure-support] to request a limit increase.<br />

<!-- LINKS - Internal -->
[basic-networking]: ../articles/aks/networking-overview.md#basic-networking
[advanced-networking]: ../articles/aks/networking-overview.md#advanced-networking

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest