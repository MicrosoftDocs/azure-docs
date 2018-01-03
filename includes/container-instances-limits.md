| Resource | Default Limit |
| --- | :---: |
| Container groups per [subscription](../articles/billing-buy-sign-up-azure-subscription.md) | 20 |
| Number of containers | 60 |
| Number of volumes | 20 |
| Ports per IP | 5 |
| Container creates per hour |60<sup>1</sup> |
| Container creates per 5 minutes | 20<sup>1</sup> |
| Container deletes per hour | 150<sup>1</sup> |
| Container deletes per 5 minutes | 50<sup>1</sup> |
| Multiple containers per group | Linux only<sup>2</sup> |
| Azure file volumes | Linux only<sup>2</sup> |
| GitRepo volumes | Linux only<sup>2</sup> |
| Secret volumes | Linux only<sup>2</sup> |

<sup>1</sup> Create an [Azure support request][azure-support] to request a limit increase.<br />
<sup>2</sup> Windows support for this feature is planned.

<!-- LINKS - Internal -->
[azure-support]: ../articles/azure-supportability/how-to-create-azure-support-request.md
