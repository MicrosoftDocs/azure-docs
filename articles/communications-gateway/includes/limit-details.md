## General restrictions

The following restrictions apply to all Azure Communications Gateways:

* All traffic must use IPv4.
* All traffic must use TLS 1.2 or greater. Earlier versions aren't supported.
* The number of active calls is limited to 15% of the number of Users assigned to the Azure Communications Gateway as defined in [Plan and manage costs for Azure Communications Gateway](/azure/comminications-gateway/plan-and-managed-costs).

## SIP message restrictions

Azure Communications Gateway applies restrictions to individual fields in SIP messages. These restrictions are applied for:

* Performance - Having to process oversize messages elements decreases system performance.
* Resilience - Some oversize message elements are commonly used in denial of service attacks to consume resources.
* Security - Some network devices may fail to process messages that exceed this limit.

### Size limits

|Resource|Limit|
|--------|-----|
|Maximum SIP message size| 10 Kilobytes|
|Maximum length of an SDP message body| 128 Kilobytes|
|Maximum length of request URI|256 Bytes|
|Maximum length of Contact header URI| 256 Bytes|
|Maximum length of the userinfo part of a URI| 256 Bytes|
|Maximum length of domain name in From header|255 Bytes|
|Maximum length of a SIP header's name| 32 Bytes|
|Maximum length of a SIP body name| 64 Bytes|
|Maximum length of a Supported, Require or Proxy-Require header| 256 Bytes|
|Maximum length of a SIP option-tag| 32 Bytes|

### Behavior restrictions

Some endpoints might add parameters in the following headers to an in-dialog message when those parameters weren't present in the dialog-creating message. In that case, Azure Communications Gateway will strip them, because this behavior isn't permitted by RFC 3261.

* Request URI
* To header
* From header
