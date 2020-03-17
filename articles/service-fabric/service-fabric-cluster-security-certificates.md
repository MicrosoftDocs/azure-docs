---
title: X.509 Certificate-based Authentication in a Service Fabric Cluster 
description: Learn about certificate-based authentication in Service Fabric clusters, and how to detect, mitigate and fix certificate-related problems.
ms.topic: conceptual
ms.date: 03/16/2020
ms.custom: sfrev
---
# X.509 Certificate-based authentication in Service Fabric clusters

This article complements the introduction to [Service Fabric cluster security](service-fabric-cluster-security.md), and goes into the details of certificate-based authentication that the Service Fabric runtime implements to secure a cluster. We assume the reader is familiar with fundamental security concepts, and also with the controls that Service Fabric exposes to control the security of a cluster.  

Topics covered under this title:

* Certificate-based authentication basics
* Identities and their respective roles
* Certificate configuration rules
* Troubleshooting and Frequently Asked Questions


## Certificate-based authentication basics
As a brief refresher, in security, a certificate is an instrument meant to denote the possession of a pair of asymmetric cryptographic keys, and so constitutes a core construct of public key cryptography. The keys represented by a certificate can be used for protecting data, or for proving the identity of key holders; when used in conjunction with a Public Key Infrastructure (PKI) system, a certificate can represent additional traits of its possessor, such as the ownership of an internet domain, or certain privileges granted to it by the issuer of the certificate. A common application of certificates is supporting the Transport Layer Security (TLS) cryptographic protocol, allowing for secure communications over a computer network. Specifically, the client and server use certificates to ensure the privacy and integrity of their communication, and also to conduct mutual authentication.

In Service Fabric, the fundamental layer of a cluster (Federation) also builds on TLS (among other protocols) to achieve a reliable, secure network of participating nodes. Connections into the cluster via Service Fabric Client APIs utilize TLS as well to protect traffic, and also to estabilishing the identities of the parties. Specifically, when used for authentication in Service Fabric, a certificate can be used to prove the following claims:
  a) the presenter of the certificate credential is in possession of the private key corresponding to the certificate
  b) the certificate's SHA-1 hash ('thumbprint') matches a declaration included in the cluster definition, or
  c) the certificate's distinguished Subject Common Name matches a declaration included in the cluster definition, and the certificate's issuer is known or trusted.

In the list above, 'b' is colloquially known as 'thumbprint pinning'; in this case, the declaration refers to a specific certificate and the strength of the authentication scheme rests on the premise that it is computationally unfeasible to forge a certificate which produces the same hash value as another one, while still being a valid/well-formed object in all other respects. Item 'c' represents an alternative form of declaring a certificate, where the strength of the scheme rests on the combination of the subject of the certificate and the issuing authority. In this case, the declaration refers to a class of certificates - any 2 certificates with the same characteristics are considered fully equivalent. 

The following sections will explain in depth how the Service Fabric runtime uses and validates certificates to ensure cluster security.

## Identities and their respective roles
Before diving into the details of authentication or securing communication channels, it is important to list the participating actors and the corresponding roles they play in a cluster:
- the Service Fabric runtime, referred to as 'system': the set of services which provide the abstractions and functionality representing the cluster. When referring to in-cluster communication between system instances, we'll use the term 'cluster identity'; when referring to the cluster as the recipient/target of traffic from outside the cluster, we'll use the term 'server identity'.
- hosted applications, referred to as 'applications': code provided by the owner of the cluster, which is orchestrated and executed in the cluster
- clients: entities allowed to connect to, and execute functionality in a cluster, according to the cluster configuration. We distinguish between 2 levels of privileges - 'user' and 'admin', respectively. A 'user' client is restricted primarily to read-only operations (but not all read-only functionality), whereas an 'admin' client has unrestricted access to the cluster's functionality. (For more details, please refer to [Security roles in a Service Fabric cluster](service-fabric-cluster-security-roles.md).)
- (Azure-only) the Service Fabric services which orchestrate and expose controls for operation and management of Service Fabric clusters, referred to as simply 'service'. Depending on the environment, the 'service' may refer to the Azure Service Fabric Resource Provider, or the Mesh Resource Provider, or other instances owned and operated by the Service Fabric team.

In a secure cluster, each of these roles can be configured with their own, distinct identity, declared as the pairing of a predefined role name and its corresponding credential. Service Fabric supports declaring credentials as certificates or domain-based service principal  . (Windows-/Kerberos-based identities are also supported, but are beyond the scope of this article; please refer to [Windows-based security in Service Fabric clusters](service-fabric-windows-cluster-windows-security.md).) In Azure clusters, client roles may also be declared as [Azure Active Directory-based identities](service-fabric-cluster-creation-setup-aad.md).

As alluded to above, the Service Fabric runtime defines 2 levels of privilege in a cluster: 'admin' and 'user'. An administrator client and a 'system' component would both operate with 'admin' privileges, and so are undistinguishable from each other. Upon establishing a connection in/to the cluster, an authenticated caller will be granted by the Service Fabric runtime one of the two roles as the base for the subsequent authorization. We'll examine authentication in depth in the following sections.

## Certificate configuration rules
### Validation rules
The security settings of a Service Fabric cluster describe, in principle, the following aspects:
- the authentication type; this is a creation-time, immutable characteristic of the cluster. Examples of such settings are 'ClusterCredentialType', 'ServerCredentialType', and allowed values are 'none', 'x509' or 'windows'. This article focuses on the x509-type authentication.
- the (authentication) validation rules; these settings are set by the cluster owner and describe which credentials shall be accepted for a given role. Examples will be examined in depth immediately below.
- settings used to tweak or subtly alter the result of authentication; examples here include flags (de)restricting enforcement of certificate revocation lists etc.

> [!NOTE]
> Cluster configuration examples provided below are excerpts from the cluster manifest in XML format, as the most-digested format which supports directly the Service Fabric functionality described in this article. The same settings can be expressed directly in the JSON representations of a cluster definition, whether a standalone json cluster manifest, or an Azure Resource Mangement template.

A certificate validation rule comprises the following elements:
- the corresponding role: client, admin client (privileged role)
- the credential accepted for the role, declared either by thumbprint or subject common name

#### Thumbprint-based certificate validation declarations
In the case of thumbprint-based validation rules, the credentials presented by a caller requesting a connection in/to the cluster will be validated as follows:
  - the credential is a valid, well-formed certificate: its chain can be built, signatures match
  - the certificate is time valid (NotBefore <= now < NotAfter)
  - the certificate's SHA-1 hash matches the declaration, as a case-insensitive string comparison excluding all whitespaces

Any trust errors encountered during chain building/validation will be suppressed for thumbprint-based declarations, with the exception of expired certificates (though provisions exist for that case as well). Specifically, failures related to: revocation status being unknown or offline, untrusted root, invalid key usage, partial chain are considered non-fatal errors; the premise, in this case, is that the certificate is merely an envelope for a key pair - the security lies in the fact that the cluster owner has set in places measure to safeguard the private key.

The following excerpt from a cluster manifest exemplifies such a set of thumbprint-based validation rules:

```xml
  <Section Name="Security">
    <Parameter Name="ClusterCredentialType" Value="X509" />
    <Parameter Name="ServerAuthCredentialType" Value="X509" />
    <Parameter Name="AdminClientCertThumbprints" Value="d5ec...4264" />
    <Parameter Name="ClientCertThumbprints" Value="7c8f...01b0" />
    <Parameter Name="ClusterCertThumbprints" Value="abcd...1234,ef01...5678" />
    <Parameter Name="ServerCertThumbprints" Value="ef01...5678" />
  </Section>
```

Each of the entries above refer to a specific identity as described earlier; each entry also allows for specifying multiple values, as comma-separated list of strings. In this example, upon successfully validating the incoming credentials, the presenter of a certificate with the SHA-1 thumbprint 'd5ec...4264' will be granted the 'admin' role; conversely, a caller authenticating with certificate '7c8f...01b0' will be granted a 'user' role, restricted to primarily read-only operations. An inbound caller which presents a certificate whose thumbprint is either 'abcd...1234' or 'ef01...5678' will be accepted as a peer node in the cluster. Lastly, a client connecting to a management endpoint of the cluster will expect the thumbprint of the server certificate to be 'ef01...5678'. 

As mentioned earlier, Service Fabric does make provisions for accepting expired certificates; the reason is that certificates do have a limited lifetime and, when declared by thumbprint (which refer to specific instances of certificates), allowing a certificate to expire will result in either failure to connect to the cluster, or an outright collapse of the cluster. It is all too easy to forget or neglect rotating a thumbprint-pinned certificate, and unfortunately the recovery from such a situation is extremely difficult.

To that end, the cluster owner can explicitly state that self-signed certificates declared by thumbprint shall be considered valid, as follows:

```xml
  <Section Name="Security">
    <Parameter Name="AcceptExpiredPinnedClusterCertificate" Value="true" />
  </Section>
```
Note that this behavior does not extend to CA-issued certificates; if that were the case, a revoked, known-to-be-compromised expired certificate could become 'valid' as soon as it would no longer figure in the CA's certificate revocation list, and thus present a security risk. With self-signed certificates, the cluster owner is considered the only party responsible for safeguarding the certificate's private key. This is not the case with CA-issued certificates - the cluster owner may not be aware of how or when their certificate was declared compromised.

#### Common name-based certificate validation declarations
Common name-based declarations take one of the following forms:
- subject common name (only)
- subject common name with issuer pinning

Let us first consider an excerpt from a cluster manifest exemplifying both declaration styles:
```xml
    <Section Name="Security/ServerX509Names">
      <Parameter Name="server.demo.system.servicefabric.azure-int" Value="" />
    </Section>
    <Section Name="Security/ClusterX509Names">
      <Parameter Name="cluster.demo.system.servicefabric.azure-int" Value="1b45...844d,d7fe...26c8,3ac7...6960,96ea...fb5e" />
    </Section>
```
The declarations refer to the server and cluster identities, respectively; note that the CN-based declarations have their own sections in the cluster manifest, separate from the standard 'Security'. In both declarations, the 'Name' represents the distinguished subject common name of the certificate, and the 'Value' field represents the expected issuer, as follows:

- in the first case, the declaration states that the common name element of the distinguished subject of the server certificate is expected to match the string "server.demo.system.servicefabric.azure-int"; the empty 'Value' field denotes the expectation that the root of the certificate chain is trusted on the node/machine where the server certificate is being validated; on Windows, this means that the certificate can chain up to any of the certificates installed in the 'Trusted Root CA' store;
- in the second case, the declaration states that the presenter of a certificate is accepted as a peer node in the cluster if the certificate's common name matches the string "cluster.demo.system.servicefabric.azure-int", *and* the thumbprint of the direct issuer of the certificate matches one of the comma-separated entries in the 'Value' field. (This rule type is colloquially known as 'common name with issuer pinning'.)

In either case, the certificate's chain is built and is expected to be error-free; that is, revocation errors, partial chain or time-invalid trust errors are considered fatal, and the certificate validation will fail. Pinning the issuers will result in considering the 'untrusted root' status as a non-fatal error; despite appearances, this is a stricter form of validation, as it allows the cluster owner to constrain the set of authorized/accepted issuers to their own PKI.

After the certificate chain is built, it is validated against a standard SSL policy with the declared subject as the remote name; a certificate will be considered a match if its subject common name or any of its subject alternative names matches the CN declaration from the cluster manifest. Wildcards are supported in this case, and the string matching is case-insensitive.

(We should clarify that the sequence described above could be executed for each type of key usage declared by the certificate; if the certificate specifies the client authentication key usage, the chain is built and evaluated first for a client role. In case of success, evaluation completes and validation is successful. If the certificate does not have the client authentication usage, or the validation failed, the Service Fabric runtime will build and evaluate the chain for server authentication.)

To complete the example, the following excerpt illustrates declaring client certificates by common name:
```xml
    <Section Name="Security/AdminClientX509Names">
      <Parameter Name="admin.demo.client.servicefabric.azure-int" Value="1b45...844d,d7fe...26c8,3ac7...6960,96ea...fb5e" />
    </Section>
    <Section Name="Security/ClientX509Names">
      <Parameter Name="user.demo.client.servicefabric.azure-int" Value="1b45...844d,d7fe...26c8,3ac7...6960,96ea...fb5e" />
    </Section>
```

The declarations above correspond to the admin and user identities, respectively; validation of certificates declared in this manner is exactly as described for the previous examples, of cluster and server certificates.

> [!NOTE]
> Common name-based declarations are meant to simplify rotation, and in general, management of cluster certificates. However, it is recommended to adhere to the following recommendations to ensure the continued availability and security of the cluster:
  * prefer issuer pinning to relying on trusted roots
  * avoid mixing issuers from different PKIs
  * ensure that all expected issuers are listed on the certificate declaration; a mismatching issuer will result in a failed validation
  * ensure that the PKI's certificate policy endpoints are discoverable, available and accessible - this means that the AIA, CRL or OCSP endpoints are declared on the leaf certificate, and that they are accessible so that certificate chain building can complete.

Tying it all together, upon receiving a request for a connection in a cluster secured with X.509 certificates, the Service Fabric runtime will use the cluster's security settings to validate the credentials of the remote party as described above; if successful, the caller/remote party is considered to be authenticated. If the credential matches multiple validation rules, the runtime will grant the caller the highest-privileged role of any of the matched rules. 

### Presentation rules
The previous section described how authentication works in a certificate-secured cluster; this section will explain how the Service Fabric runtime itself discovers and loads the certificates it uses for in-cluster communication; we call these the "presentation" rules.

As with the validation rules, the presentation rules specify a role and the associated credential declaration, expressed either by thumbprint or common name. Unlike the validation rules, common name-based declarations do not have provisions for issuer pinning; this allows for greater flexibility as well as improved performance. The presentation rules are declared in the 'NodeType' section(s) of the cluster manifest, for each distinct node type; the settings are split from the Security sections of the cluster to allow each node type to have its full configuration in a single section. In Azure Service Fabric clusters, the node type certificate declarations default to their corresponding settings in the Security section of the definition of the cluster.

#### Thumbprint-based certificate presentation declarations
As previously described, the Service Fabric runtime distinguishes between its role as the peer of other nodes in the cluster, and as the server for cluster management operations. In principle these settings can be configured distinctly, but in practice they tend to align. For the remainder of this article, we'll assume the settings match for simplicity.

Let us consider the following excerpt from a cluster manifest:
```xml
  <NodeTypes>
    <NodeType Name="nt1vm">
      <Certificates>
        <ClusterCertificate X509FindType="FindByThumbprint" X509FindValue="cc71...1984" X509FindValueSecondary="49e2...19d6" X509StoreName="my" Name="ClusterCertificate" />
        <ServerCertificate X509FindValue="cc71...1984" Name="ServerCertificate" />
        <ClientCertificate X509FindValue="cc71...1984" Name="ClientCertificate" />
      </Certificates>
    </NodeType>
  </NodeTypes>
```
The 'ClusterCertificate' element demonstrates the full schema, including optional parameters ('X509FindValueSecondary') or those with appropriate defaults ('X509StoreName'); the other declarations show an abbreviated form. The cluster certificate declaration above states that the security settings of nodes of type 'nt1vm' are initialized with certificate 'cc71..1984' as the primary, and the '49e2..19d6' certificate as the secondarty; both certificates are expected to be found in the LocalMachine\'My' certificate store (or Linux equivalent of *var/lib/sfcerts*).

#### Common name-based certificate presentation declarations
The node type certificates can also be declared by subject common name, as exemplified below:

```xml
  <NodeTypes>
    <NodeType Name="nt1vm">
      <Certificates>
        <ClusterCertificate X509FindType="FindBySubjectName" X509FindValue="demo.cluster.azuredocpr.system.servicefabric.azure-int" Name="ClusterCertificate" />
      </Certificates>
    </NodeType>
  </NodeTypes>
```

For either type of declaration, a Service Fabric node will read the configuration at startup, locate and load the specified certificates, and sort them in descending order of their NotAfter attribute; expired certificates are ignored, and the first element of the list is selected as the client credential for any Service Fabric connection attempted by this node. (In effect, Service Fabric favors the farthest expiring certificate.)

Note that, for common-name based presentation declarations, a certificate is considered a match if its subject common name is equal to the X509FindValue (or X509FindValueSecondary) field of the declaration as a case-sensitive, exact string comparison. This is in contrast with the validation rules, which does support wildcard matching, as well as case-insensitive string comparisons.  


## Troubleshooting and Frequently Asked Questions
The separation of presentation and validation rules poses the obvious question (or concern) of whether they can diverge, and what the consequences would be. It is, indeed, possible that a node's selection of an authentication certificate won't pass the validation rules of another node. In fact, this discrepancy is the primary cause of authentication-related incidents. At the same time, the separation of these rules allows for a cluster to continue operating during an upgrade which changes the cluster security. Consider that, by augmenting first the validation rules as a first step, all of the cluster's nodes will converge on the new settings while still using the current credentials. 

To illustrate how a cluster upgrade behaves upon changing its security settings, let us consider the following (obvious) examples; we will use the following notation to describe a node's security settings:

    N*k*: {P:{TP=A}, V:{TP=A}}, meaning that node *k* is configured to present certificate A declared by thumbprint, and to validate remote certificates by thumbprint, with expected value A. Conversely, a CN=B declaration refers to a certificate declared by common name. 

  - rotating a cluster certificate declared by thumbprint: 
        initial state: N0 = {P:{TP=A}, V:{TP=A}}, ... Nk = {P:{TP=A}, V:{TP=A}} - the cluster is at rest, all nodes share a common configuration
        after upgrade domain 0: N0 = {P:{TP=A}, V:{TP=A, TP=B}}, ... Nk = {P:{TP=A}, V:{TP=A}} - nodes in UD0 will present certificate A, and accept certificates A or B; all other nodes present and accept certificate A only
        after the last upgrade domain: N0 = {P:{TP=A}, V:{TP=A, TP=B}}, ... Nk = {P:{TP=A}, V:{TP=A, TP=B}} - all nodes present certificate A, all nodes would accept either certificate A or B
      
      At this point, the cluster is again in equillibrium; the second phase of the upgrade/changing security settings can commence:
        after upgrade domain 0: N0 = {P:{TP=A, TP=B}, V:{TP=A, TP=B}}, ... Nk = {P:{TP=A}, V:{TP=A, TP=B}} - nodes in UD0 will start presenting B, which is accepted by any other node in the cluster.
        after the last upgrade domain: N0 = {P:{TP=A, TP=B}, V:{TP=A, TP=B}}, ... Nk = {P:{TP=A, TP=B}, V:{TP=A, TP=B}} - all nodes have switched to presenting certificate B. Certificate A can now be retired/removed from the cluster definition.

  - converting a cluster from thumbprint- to common-name-based certificate declarations - similarly, changing the type of certificate declaration (from thumbprint to common name) should follow the same pattern as above. Note that validation rules allow declaring the certificates of a given role by both thumbprint and common name in the same cluster definition. By contrast, though, the presentation rules allow only one form of declaration. Continuing the example from above:

      initial state: N0 = {P:{TP=A}, V:{TP=A}}, ... Nk = {P:{TP=A}, V:{TP=A}} - the cluster is at rest, all nodes share a common configuration
      after upgrade domain 0: N0 = {P:{TP=A}, V:{TP=A, CN=B}}, ... Nk = {P:{TP=A}, V:{TP=A}} - nodes in UD0 will present certificate A, and accept certificates with either thumbprint A or common name B; all other nodes present and accept certificate A only
      after the last upgrade domain: N0 = {P:{TP=A}, V:{TP=A, CN=B}}, ... Nk = {P:{TP=A}, V:{TP=A, CN=B}} - all nodes present certificate A, all nodes would accept either certificate A (TP) or B (CN)

    At this point we can proceed with changing the presentation rules with a subsequent upgrade:
      after upgrade domain 0: N0 = {P:{CN=B}, V:{TP=A, CN=B}}, ... Nk = {P:{TP=A}, V:{TP=A, CN=B}} - nodes in UD0 will present certificate B found by CN, and accept certificates with either thumbprint A or common name B; all other nodes present and accept certificate A only, selected by thumbprint
      after the last upgrade domain: N0 = {P:{CN=B}, V:{TP=A, CN=B}}, ... Nk = {P:{CN=B}, V:{TP=A, CN=B}} - all nodes present certificate B found by CN, all nodes would accept either certificate A (TP) or B (CN)
    
    At this point the cluster has been converted to common name-based certificates, and the thumbprint-based declaration can be removed.

In a separate article we will address the topic of managing and provisioning certificates into a Service Fabric cluster.