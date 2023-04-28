---

title: Traffic Controller API Specification for Kubernetes
titlesuffix: Azure Application Load Balancer
description: This article provides documentation for Traffic Controller's API specification for Kubernetes.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: article
ms.date: 5/1/2023
ms.author: greglin
---

# Traffic Controller API Specification for Kubernetes

## networking.azure.io/v1alpha1 API
This document defines each of the resource types for `networking.azure.io/v1alpha1`.

### BackendTLSPolicy
BackendTLSPolicy is the schema for the BackendTLSPolicys API

| Field	| Description |
| ------- | ------------------------- |
| `metadata`<br/>Kubernetes meta/v1.ObjectMeta | (Optional)<br/>Object's metadata.<br/><br/>Refer to the Kubernetes API documentation for the fields of the metadata field. |
| `spec`<br/>BackendTLSPolicySpec	| Spec is the BackendTLSPolicy specification.<br/><br/><table><tr><td><code>targetRef</code><br><em><a href="https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.PolicyTargetReference" rel="nofollow">Gateway API.PolicyTargetReference</a></em><td><p dir="auto">TargetRef identifies an API object to apply policy to.<tr><td><code>override</code><br><em><a href="#networking.azure.io/v1alpha1.BackendTLSPolicyConfig">BackendTLSPolicyConfig</a></em><td><em>(Optional)</em><p dir="auto">Override defines policy configuration that should override policy configuration attached below the targeted resource in the hierarchy.<tr><td><code>default</code><br><em><a href="#networking.azure.io/v1alpha1.BackendTLSPolicyConfig">BackendTLSPolicyConfig</a></em><td><em>(Optional)</em><p dir="auto">Default defines default policy configuration for the targeted resource.</table> |
| `status`<br/>BackendTLSPolicyStatus	| Status defines the current state of BackendTLSPolicy. |

### BackendTLSPolicyConditionReason (string alias)
BackendTLSPolicyConditionReason defines the set of reasons that explain why a particular BackendTLSPolicy condition type has been raised.

| Value	| Description |
| ------- | ------------------------- |
| "InvalidCertificateRef" | BackendTLSPolicyInvalidCertificateRef is used when an invalid certificate is referenced |
| "Accepted" | BackendTLSPolicyReasonAccepted is used to set the BackendTLSPolicyConditionReason to Accepted When the given BackendTLSPolicy is correctly configured |
| "InvalidBackendTLSPolicy" | BackendTLSPolicyReasonInvalid is the reason when the BackendTLSPolicy isn't accepted |
| "InvalidKind" | BackendTLSPolicyReasonInvalidKind is used when the kind/group is invalid |
| "NoTargetReference" | BackendTLSPolicyReasonNoTargetReference is used when there's no target reference |
| "RefNotPermitted" | BackendTLSPolicyReasonRefNotPermitted is used when the ref isn't permitted |
| "ServiceNotFound" | BackendTLSPolicyReasonServiceNotFound is used when the ref service isn't found |
| "Degraded" | ReasonDegraded is the backendTLSPolicyConditionReason when the backendTLSPolicy has been incorrectly programmed | 

### BackendTLSPolicyConditionType (string alias)
BackendTLSPolicyConditionType is a type of condition associated with a BackendTLSPolicy. This type should be used with the `BackendTLSPolicyStatus.Conditions` field.

| Value	| Description |
| ------- | ------------------------- |
| "Accepted" | BackendTLSPolicyConditionAccepted is used to set the BackendTLSPolicyCondition to Accepted |
| "Ready" | BackendTLSPolicyConditionReady is used to set the condition to Ready | 
| "ResolvedRefs" | BackendTLSPolicyConditionResolvedRefs is used to set the BackendTLSPolicyCondition to ResolvedRefs This is used with the following reasons: *BackendTLSPolicyReasonRefNotPermitted *BackendTLSPolicyReasonInvalidKind *BackendTLSPolicyReasonServiceNotFound *BackendTLSPolicyInvalidCertificateRef *ReasonDegraded |

### BackendTLSPolicyConfig
(Appears on:BackendTLSPolicySpec)

BackendTLSPolicyConfig defines the policy specification for the Backend TLS Policy.

| Field | Description |
| ------- | ------------------------- |
| `CommonTLSPolicy`<br/>CommonTLSPolicy | (Members of CommonTLSPolicy are embedded into this type.) |
| `sni`<br/>string | (Optional)<br/>Sni is the server name to use for the TLS connection to the backend. |
| `ports`<br/>[]BackendTLSPolicyPort | Ports specifies the list of ports where the policy is applied. |
| `clientCertificateRef`<br/>Gateway API.SecretObjectReference	| (Optional)<br/>ClientCertificateRef is the reference to the client certificate to use for the TLS connection to the backend. |

### BackendTLSPolicyPort
(Appears on:BackendTLSPolicyConfig)

BackendTLSPolicyPort defines the port to use for the TLS connection to the backend

| Field | Description |
| ------- | ------------------------- |
| `port`<br/>_int_ | Port is the port to use for the TLS connection to the backend |

### BackendTLSPolicySpec
(Appears on:BackendTLSPolicy)

BackendTLSPolicySpec defines the desired state of BackendTLSPolicy

| Field | Description |
| ------- | ------------------------- |
| `targetRef`<br/>Gateway API.PolicyTargetReference | TargetRef identifies an API object to apply policy to. |
| `override`<br/>BackendTLSPolicyConfig | (Optional)<br/>Override defines policy configuration that should override policy configuration attached below the targeted resource in the hierarchy. |
| `default`<br/>BackendTLSPolicyConfig | (Optional)<br/>Default defines default policy configuration for the targeted resource. |

### BackendTLSPolicyStatus
(Appears on:BackendTLSPolicy)

BackendTLSPolicyStatus defines the observed state of BackendTLSPolicy.

| Field | Description |
| ------- | ------------------------- |
| `conditions`<br/>[]Kubernetes meta/v1.Condition | (Optional)<br/>Conditions describe the current conditions of the BackendTLSPolicy.<br/><br/>Implementations should prefer to express BackendTLSPolicy conditions using the BackendTLSPolicyConditionType and BackendTLSPolicyConditionReason constants so that operators and tools can converge on a common vocabulary to describe BackendTLSPolicy state.<br/><br/>Known condition types are:<br/>- "Accepted"<br/>-"Ready" |


### CommonTLSPolicy
(Appears on:BackendTLSPolicyConfig)

CommonTLSPolicy is the schema for the CommonTLSPolicy API

| Field | Description |
| ------- | ------------------------- |
| `verify`<br/>CommonTLSPolicyVerify | _(Optional)_ Verify provides the options to verify the backend certificate |

### CommonTLSPolicyVerify
(Appears on:CommonTLSPolicy)

CommonTLSPolicyVerify defines the schema for the CommonTLSPolicyVerify API

| Field | Description |
| ------------------------- | ------- |
| `caCertificateRef`<br/> Gateway API.SecretObjectReference | CaCertificateRef is the CA certificate used to verify peer certificate of the backend. |
| `subjectAltName`<br/>_string_ | SubjectAltName is the subject alternative name used to verify peer certificate of the backend. |
