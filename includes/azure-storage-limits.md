| Resource | Default Limit |
| --- | --- |
| Number of storage accounts per subscription | 200<sup>1</sup> |
| Max storage account capacity | 500 TiB<sup>2</sup> |
| Max number of blob containers, blobs, file shares, tables, queues, entities, or messages per storage account | No limit |
| Max ingress<sup>3</sup> per storage account (US Regions) | 10 Gbps if GRS/ZRS<sup>4</sup> enabled, 20 Gbps for LRS<sup>2</sup> |
| Max egress<sup>3</sup> per storage account (US Regions) | 20 Gbps if RA-GRS/GRS/ZRS<sup>4</sup> enabled, 30 Gbps for LRS<sup>2</sup> |
| Max ingress<sup>3</sup> per storage account (Non-US regions) | 5 Gbps if GRS/ZRS<sup>4</sup> enabled, 10 Gbps for LRS<sup>2</sup> |
| Max egress<sup>3</sup> per storage account (Non-US regions) | 10 Gbps if RA-GRS/GRS/ZRS<sup>4</sup> enabled, 15 Gbps for LRS<sup>2</sup> |

<sup>1</sup>Includes both Standard and Premium storage accounts. If you require more than 200 storage accounts, make a request through [Azure Support](https://azure.microsoft.com/support/faq/). The Azure Storage team will review your business case and may approve up to 250 storage accounts. 

<sup>2</sup> To get your standard storage accounts to grow past the advertised limits in capacity, ingress/egress and request rate, please make a request through [Azure Support](https://azure.microsoft.com/support/faq/). The Azure Storage team will review the request and may approve higher limits on a case by case basis.

<sup>3</sup> Capped only by the account's ingress/egress limits. *Ingress* refers to all data (requests) being sent to a storage account. *Egress* refers to all data (responses) being received from a storage account.  

<sup>4</sup>Azure Storage redundancy options include:
* **RA-GRS**: Read-access geo-redundant storage. If RA-GRS is enabled, egress targets for the secondary location are identical to those for the primary location.
* **GRS**:  Geo-redundant storage. 
* **ZRS**: Zone-redundant storage. Available only for block blobs. 
* **LRS**: Locally redundant storage. 