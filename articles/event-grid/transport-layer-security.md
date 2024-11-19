---
title: Transport Layer Security support in Azure Event Grid
description: Describes the vulnerabilities of TLS 1.0 and 1.1 and benefits of upgrading to a later version, especially 1.3. 
ms.topic: concept-article
ms.date: 11/18/2024
ms.author: robece
# Customer intent: I want to know which version of TLS is supported and recommended by Azure Event Grid. 
---

# Disable TLS 1.0 and TLS 1.1, and enable TLS 1.2 and 1.3 in Azure Event Grid 

In an era where cybersecurity threats are increasingly sophisticated, it's imperative for organizations to employ the most secure protocols available. Transport Layer Security (TLS) is a critical component of internet security, providing encrypted communication channels between clients and servers. As the TLS protocol evolves, older versions such as TLS 1.0 and TLS 1.1 become susceptible to vulnerabilities that can compromise data integrity and confidentiality. This article outlines the reasons why disabling TLS 1.0 and TLS 1.1 in Azure Event Grid is essential for maintaining robust security. 

## Security vulnerabilities of TLS 1.0 and TLS 1.1 

TLS 1.0 and TLS 1.1 were groundbreaking at the time of their release, but they now exhibit several security weaknesses that render them inadequate for current cybersecurity standards. 

## Known vulnerabilities 

Both TLS 1.0 and TLS 1.1 are susceptible to various attacks, including: 

- **BEAST attack**: Browser Exploit Against SSL or TLS (BEAST) can exploit vulnerabilities in TLS 1.0, allowing attackers to decrypt data. 
- **POODLE Attack**: Padding Oracle On Downgraded Legacy Encryption (POODLE) targets both SSL 3.0 and TLS 1.0, enabling attackers to decrypt secure communications.
- **RC4 Cipher**: TLS 1.0 and TLS 1.1 often relied on the RC4 cipher, which is found to be insecure and is no longer recommended. 

## Compliance requirements 

Many industry regulations and standards, such as PCI-DSS and HIPAA, now mandate the use of TLS 1.2 or higher for secure communications. Continuing to support TLS 1.0 and TLS 1.1 can result in noncompliance, leading to potential fines and reputation damage. 

## Benefits of upgrading to TLS 1.3 

TLS 1.3 introduces several improvements over its predecessors, offering enhanced security and performance. 

### Enhanced security 

TLS 1.3 eliminates outdated cryptographic algorithms and simplifies the handshake process, reducing the attack surface. It also provides forward secrecy, ensuring that session keys can't be compromised even if the server's long-term key is compromised in the future. 

### Improved performance 

One of the significant optimizations in TLS 1.3 is the reduction in the number of round trips required for the handshake process. While TLS 1.2 requires two round trips, TLS 1.3 reduces it to one trip, which accelerates the connection establishment. For clients that previously connected to the same server, TLS 1.3 enables zero-round-trip handshakes, further minimizing latency. 

## Conclusion 
Disabling TLS 1.0 and TLS 1.1 in Azure Event Grid is a crucial step towards ensuring the security and integrity of data transmissions. By adopting TLS 1.2 and TLS 1.3, organizations can benefit from enhanced security features and improved performance, aligning with best practices and compliance requirements. As cybersecurity threats continue to evolve, it's imperative to stay ahead by using the most advanced and secure protocols available. 

## Related content
If you are using Event Grid Basic, see the following articles:

- [Configure the minimum TLS version for an Event Grid topic or domain](transport-layer-security-configure-minimum-version.md)
- [Enforce a minimum required version of Transport Layer Security (TLS) for an Event Grid topic, domain, or subscription](transport-layer-security-enforce-minimum-version.md)