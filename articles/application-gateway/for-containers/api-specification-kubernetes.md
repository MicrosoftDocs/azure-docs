---

title: Application Gateway for Containers API Specification for Kubernetes (preview)
description: This article provides documentation for Application Gateway for Containers' API specification for Kubernetes.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: appgw-for-containers
ms.topic: article
ms.date: 7/24/2023
ms.author: greglin
---

# Application Gateway for Containers API specification for Kubernetes (preview)

## Packages

Package v1 is the v1 version of the API.

### alb.networking.azure.io/v1
This document defines each of the resource types for `alb.networking.azure.io/v1`.

### Resource Types:
<h3 id="alb.networking.azure.io/v1.AffinityType">AffinityType
(<code>string</code> alias)</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.SessionAffinity">SessionAffinity</a>)
</p>
<div>
<p>AffinityType defines the affinity type for the Service</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;application-cookie&#34;</p></td>
<td><p>AffinityTypeApplicationCookie is a session affinity type for an application cookie</p>
</td>
</tr><tr><td><p>&#34;managed-cookie&#34;</p></td>
<td><p>AffinityTypeManagedCookie is a session affinity type for a managed cookie</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.AlbConditionReason">AlbConditionReason
(<code>string</code> alias)</h3>
<div>
<p>AlbConditionReason defines the set of reasons that explain
why a particular condition type has been raised on the Application Gateway for Containers resource.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;Accepted&#34;</p></td>
<td><p>AlbReasonAccepted indicates the Application Gateway for Containers resource
has been accepted by the controller.</p>
</td>
</tr><tr><td><p>&#34;Ready&#34;</p></td>
<td><p>AlbReasonDeploymentReady indicates the Application Gateway for Containers resource
deployment status.</p>
</td>
</tr><tr><td><p>&#34;InProgress&#34;</p></td>
<td><p>AlbReasonInProgress indicates whether the Application Gateway for Containers resource
is in the process of being created, updated or deleted.</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.AlbConditionType">AlbConditionType
(<code>string</code> alias)</h3>
<div>
<p>AlbConditionType is a type of condition associated with an Application Gateway for Containers resource. This type should be used with the AlbStatus.Conditions
field.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;Accepted&#34;</p></td>
<td><p>AlbConditionTypeAccepted indicates whether the Application Gateway for Containers resource
has been accepted by the controller.</p>
</td>
</tr><tr><td><p>&#34;Deployment&#34;</p></td>
<td><p>AlbConditionTypeDeployment indicates the deployment status of the Application Gateway for Containers resource.</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.AlbSpec">AlbSpec
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.ApplicationLoadBalancer">ApplicationLoadBalancer</a>)
</p>
<div>
<p>AlbSpec defines the specifications for Application Gateway for Containers resource.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>associations</code><br/>
<em>
[]string
</em>
</td>
<td>
<p>Associations are subnet resource IDs the Application Gateway for Containers resource will be associated with.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.AlbStatus">AlbStatus
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.ApplicationLoadBalancer">ApplicationLoadBalancer</a>)
</p>
<div>
<p>AlbStatus defines the observed state of Application Gateway for Containers resource.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>conditions</code><br/>
<em>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Condition">
[]Kubernetes meta/v1.Condition
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Known condition types are:</p>
<ul>
<li>&ldquo;Accepted&rdquo;</li>
<li>&ldquo;Ready&rdquo;</li>
</ul>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.ApplicationLoadBalancer">ApplicationLoadBalancer
</h3>
<div>
<p>ApplicationLoadBalancer is the schema for the Application Gateway for Containers resource.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>metadata</code><br/>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta">
Kubernetes meta/v1.ObjectMeta
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Object&rsquo;s metadata.</p>
Refer to the Kubernetes API documentation for the fields of the
<code>metadata</code> field.
</td>
</tr>
<tr>
<td>
<code>spec</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.AlbSpec">
AlbSpec
</a>
</em>
</td>
<td>
<p>Spec is the specifications for Application Gateway for Containers resource.</p>
<br/>
<br/>
<table>
<tr>
<td>
<code>associations</code><br/>
<em>
[]string
</em>
</td>
<td>
<p>Associations are subnet resource IDs the Application Gateway for Containers resource will be associated with.</p>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td>
<code>status</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.AlbStatus">
AlbStatus
</a>
</em>
</td>
<td>
<p>Status defines the current state of Application Gateway for Containers resource.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.BackendTLSPolicy">BackendTLSPolicy
</h3>
<div>
<p>BackendTLSPolicy is the schema for the BackendTLSPolicys API</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>metadata</code><br/>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta">
Kubernetes meta/v1.ObjectMeta
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Object&rsquo;s metadata.</p>
Refer to the Kubernetes API documentation for the fields of the
<code>metadata</code> field.
</td>
</tr>
<tr>
<td>
<code>spec</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.BackendTLSPolicySpec">
BackendTLSPolicySpec
</a>
</em>
</td>
<td>
<p>Spec is the BackendTLSPolicy specification.</p>
<br/>
<br/>
<table>
<tr>
<td>
<code>targetRef</code><br/>
<em>
<a href="https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.PolicyTargetReference">
Gateway API .PolicyTargetReference
</a>
</em>
</td>
<td>
<p>TargetRef identifies an API object to apply policy to.</p>
</td>
</tr>
<tr>
<td>
<code>override</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.BackendTLSPolicyConfig">
BackendTLSPolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Override defines policy configuration that should override policy
configuration attached below the targeted resource in the hierarchy.</p>
</td>
</tr>
<tr>
<td>
<code>default</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.BackendTLSPolicyConfig">
BackendTLSPolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Default defines default policy configuration for the targeted resource.</p>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td>
<code>status</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.BackendTLSPolicyStatus">
BackendTLSPolicyStatus
</a>
</em>
</td>
<td>
<p>Status defines the current state of BackendTLSPolicy.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.BackendTLSPolicyConditionReason">BackendTLSPolicyConditionReason
(<code>string</code> alias)</h3>
<div>
<p>BackendTLSPolicyConditionReason defines the set of reasons that explain why a
particular BackendTLSPolicy condition type has been raised.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;InvalidCertificateRef&#34;</p></td>
<td><p>BackendTLSPolicyInvalidCertificateRef is used when an invalid certificate is referenced</p>
</td>
</tr><tr><td><p>&#34;Accepted&#34;</p></td>
<td><p>BackendTLSPolicyReasonAccepted is used to set the BackendTLSPolicyConditionReason to Accepted
When the given BackendTLSPolicy is correctly configured</p>
</td>
</tr><tr><td><p>&#34;InvalidBackendTLSPolicy&#34;</p></td>
<td><p>BackendTLSPolicyReasonInvalid is the reason when the BackendTLSPolicy isn't Accepted</p>
</td>
</tr><tr><td><p>&#34;InvalidKind&#34;</p></td>
<td><p>BackendTLSPolicyReasonInvalidKind is used when the kind/group is invalid</p>
</td>
</tr><tr><td><p>&#34;NoTargetReference&#34;</p></td>
<td><p>BackendTLSPolicyReasonNoTargetReference is used when there is no target reference</p>
</td>
</tr><tr><td><p>&#34;RefNotPermitted&#34;</p></td>
<td><p>BackendTLSPolicyReasonRefNotPermitted is used when the ref isn't permitted</p>
</td>
</tr><tr><td><p>&#34;ServiceNotFound&#34;</p></td>
<td><p>BackendTLSPolicyReasonServiceNotFound is used when the ref service isn't found</p>
</td>
</tr><tr><td><p>&#34;Degraded&#34;</p></td>
<td><p>ReasonDegraded is the backendTLSPolicyConditionReason when the backendTLSPolicy has been incorrectly programmed</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.BackendTLSPolicyConditionType">BackendTLSPolicyConditionType
(<code>string</code> alias)</h3>
<div>
<p>BackendTLSPolicyConditionType is a type of condition associated with a
BackendTLSPolicy. This type should be used with the BackendTLSPolicyStatus.Conditions
field.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;Accepted&#34;</p></td>
<td><p>BackendTLSPolicyConditionAccepted is used to set the BackendTLSPolicyCondition to Accepted</p>
</td>
</tr><tr><td><p>&#34;Ready&#34;</p></td>
<td><p>BackendTLSPolicyConditionReady is used to set the condition to Ready</p>
</td>
</tr><tr><td><p>&#34;ResolvedRefs&#34;</p></td>
<td><p>BackendTLSPolicyConditionResolvedRefs is used to set the BackendTLSPolicyCondition to ResolvedRefs
This is used with the following Reasons :
*BackendTLSPolicyReasonRefNotPermitted
*BackendTLSPolicyReasonInvalidKind
*BackendTLSPolicyReasonServiceNotFound
*BackendTLSPolicyInvalidCertificateRef
*ReasonDegraded</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.BackendTLSPolicyConfig">BackendTLSPolicyConfig
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.BackendTLSPolicySpec">BackendTLSPolicySpec</a>)
</p>
<div>
<p>BackendTLSPolicyConfig defines the policy specification for the Backend TLS
Policy.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>CommonTLSPolicy</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.CommonTLSPolicy">
CommonTLSPolicy
</a>
</em>
</td>
<td>
<p>
(Members of <code>CommonTLSPolicy</code> are embedded into this type.)
</p>
</td>
</tr>
<tr>
<td>
<code>sni</code><br/>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Sni is the server name to use for the TLS connection to the backend.</p>
</td>
</tr>
<tr>
<td>
<code>ports</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.BackendTLSPolicyPort">
[]BackendTLSPolicyPort
</a>
</em>
</td>
<td>
<p>Ports specifies the list of ports where the policy is applied.</p>
</td>
</tr>
<tr>
<td>
<code>clientCertificateRef</code><br/>
<em>
<a href="https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1beta1.SecretObjectReference">
Gateway API .SecretObjectReference
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>ClientCertificateRef is the reference to the client certificate to
use for the TLS connection to the backend.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.BackendTLSPolicyPort">BackendTLSPolicyPort
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.BackendTLSPolicyConfig">BackendTLSPolicyConfig</a>)
</p>
<div>
<p>BackendTLSPolicyPort defines the port to use for the TLS connection to the backend</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>port</code><br/>
<em>
int
</em>
</td>
<td>
<p>Port is the port to use for the TLS connection to the backend</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.BackendTLSPolicySpec">BackendTLSPolicySpec
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.BackendTLSPolicy">BackendTLSPolicy</a>)
</p>
<div>
<p>BackendTLSPolicySpec defines the desired state of BackendTLSPolicy</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>targetRef</code><br/>
<em>
<a href="https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.PolicyTargetReference">
Gateway API .PolicyTargetReference
</a>
</em>
</td>
<td>
<p>TargetRef identifies an API object to apply policy to.</p>
</td>
</tr>
<tr>
<td>
<code>override</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.BackendTLSPolicyConfig">
BackendTLSPolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Override defines policy configuration that should override policy
configuration attached below the targeted resource in the hierarchy.</p>
</td>
</tr>
<tr>
<td>
<code>default</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.BackendTLSPolicyConfig">
BackendTLSPolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Default defines default policy configuration for the targeted resource.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.BackendTLSPolicyStatus">BackendTLSPolicyStatus
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.BackendTLSPolicy">BackendTLSPolicy</a>)
</p>
<div>
<p>BackendTLSPolicyStatus defines the observed state of BackendTLSPolicy.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>conditions</code><br/>
<em>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Condition">
[]Kubernetes meta/v1.Condition
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Conditions describe the current conditions of the BackendTLSPolicy.</p>
<p>Implementations should prefer to express BackendTLSPolicy conditions
using the <code>BackendTLSPolicyConditionType</code> and <code>BackendTLSPolicyConditionReason</code>
constants so that operators and tools can converge on a common
vocabulary to describe BackendTLSPolicy state.</p>
<p>Known condition types are:</p>
<ul>
<li>&ldquo;Accepted&rdquo;</li>
<li>&ldquo;Ready&rdquo;</li>
</ul>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.CommonTLSPolicy">CommonTLSPolicy
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.BackendTLSPolicyConfig">BackendTLSPolicyConfig</a>)
</p>
<div>
<p>CommonTLSPolicy is the schema for the CommonTLSPolicy API</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>verify</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.CommonTLSPolicyVerify">
CommonTLSPolicyVerify
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Verify provides the options to verify the backend certificate</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.CommonTLSPolicyVerify">CommonTLSPolicyVerify
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.CommonTLSPolicy">CommonTLSPolicy</a>)
</p>
<div>
<p>CommonTLSPolicyVerify defines the schema for the CommonTLSPolicyVerify API</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>caCertificateRef</code><br/>
<em>
<a href="https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1beta1.SecretObjectReference">
Gateway API .SecretObjectReference
</a>
</em>
</td>
<td>
<p>CaCertificateRef is the CA certificate used to verify peer certificate of
the backend.</p>
</td>
</tr>
<tr>
<td>
<code>subjectAltName</code><br/>
<em>
string
</em>
</td>
<td>
<p>SubjectAltName is the subject alternative name used to verify peer
certificate of the backend.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.CustomTargetRef">CustomTargetRef
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.FrontendTLSPolicySpec">FrontendTLSPolicySpec</a>)
</p>
<div>
<p>CustomTargetRef is a reference to a custom resource that isn't part of the
Kubernetes core API.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>name</code><br/>
<em>
string
</em>
</td>
<td>
<p>Name is the name of the referent.</p>
</td>
</tr>
<tr>
<td>
<code>kind</code><br/>
<em>
string
</em>
</td>
<td>
<p>Kind is the kind of the referent.</p>
</td>
</tr>
<tr>
<td>
<code>gateway</code><br/>
<em>
string
</em>
</td>
<td>
<p>Gateway is the name of the Gateway.</p>
</td>
</tr>
<tr>
<td>
<code>listeners</code><br/>
<em>
[]string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Listener is the name of the Listener.</p>
</td>
</tr>
<tr>
<td>
<code>namespace</code><br/>
<em>
<a href="https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1beta1.Namespace">
Gateway API .Namespace
</a>
</em>
</td>
<td>
<p>Namespace is the namespace of the referent. When unspecified, the local</p>
</td>
</tr>
<tr>
<td>
<code>group</code><br/>
<em>
<a href="https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1beta1.Group">
Gateway API .Group
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Group is the group of the referent.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.FrontendTLSPolicy">FrontendTLSPolicy
</h3>
<div>
<p>FrontendTLSPolicy is the schema for the FrontendTLSPolicy API</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>metadata</code><br/>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta">
Kubernetes meta/v1.ObjectMeta
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Object&rsquo;s metadata.</p>
Refer to the Kubernetes API documentation for the fields of the
<code>metadata</code> field.
</td>
</tr>
<tr>
<td>
<code>spec</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.FrontendTLSPolicySpec">
FrontendTLSPolicySpec
</a>
</em>
</td>
<td>
<p>Spec is the FrontendTLSPolicy specification.</p>
<br/>
<br/>
<table>
<tr>
<td>
<code>targetRef</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.CustomTargetRef">
CustomTargetRef
</a>
</em>
</td>
<td>
<p>TargetRef identifies an API object to apply policy to.</p>
</td>
</tr>
<tr>
<td>
<code>default</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.FrontendTLSPolicyConfig">
FrontendTLSPolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Default defines default policy configuration for the targeted resource.</p>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td>
<code>status</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.FrontendTLSPolicyStatus">
FrontendTLSPolicyStatus
</a>
</em>
</td>
<td>
<p>Status defines the current state of FrontendTLSPolicy.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.FrontendTLSPolicyConditionReason">FrontendTLSPolicyConditionReason
(<code>string</code> alias)</h3>
<div>
<p>FrontendTLSPolicyConditionReason defines the set of reasons that explain why a
particular FrontTLSPolicy condition type has been raised.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;InvalidGroup&#34;</p></td>
<td><p>FrontTLSPolicyReasonInvalidGroup is used when the group is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidKind&#34;</p></td>
<td><p>FrontTLSPolicyReasonInvalidKind is used when the kind/group is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidName&#34;</p></td>
<td><p>FrontTLSPolicyReasonInvalidName is used when the name is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidPolicyName&#34;</p></td>
<td><p>FrontTLSPolicyReasonInvalidPolicyName is used when the name is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidPolicyType&#34;</p></td>
<td><p>FrontTLSPolicyReasonInvalidPolicyType is used when the type is invalid</p>
</td>
</tr><tr><td><p>&#34;NoTargetReference&#34;</p></td>
<td><p>FrontTLSPolicyReasonNoTargetReference is used when there is no target reference</p>
</td>
</tr><tr><td><p>&#34;RefNotPermitted&#34;</p></td>
<td><p>FrontTLSPolicyReasonRefNotPermitted is used when the ref isn't permitted</p>
</td>
</tr><tr><td><p>&#34;Accepted&#34;</p></td>
<td><p>FrontendTLSPolicyReasonAccepted is used to set the FrontTLSPolicyConditionReason to Accepted
When the given FrontTLSPolicy is correctly configured</p>
</td>
</tr><tr><td><p>&#34;InvalidFrontendTLSPolicy&#34;</p></td>
<td><p>FrontendTLSPolicyReasonInvalid is the reason when the FrontendTLSPolicy isn't Accepted</p>
</td>
</tr><tr><td><p>&#34;InvalidGateway&#34;</p></td>
<td><p>FrontendTLSPolicyReasonInvalidGateway is used when the gateway is invalid</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.FrontendTLSPolicyConditionType">FrontendTLSPolicyConditionType
(<code>string</code> alias)</h3>
<div>
<p>FrontendTLSPolicyConditionType is a type of condition associated with a
FrontendTLSPolicy. This type should be used with the FrontendTLSPolicyStatus.Conditions
field.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;Accepted&#34;</p></td>
<td><p>FrontendTLSPolicyConditionAccepted is used to set the FrontendTLSPolicyCondition to Accepted</p>
</td>
</tr><tr><td><p>&#34;ResolvedRefs&#34;</p></td>
<td><p>FrontendTLSPolicyConditionResolvedRefs is used to set the FrontendTLSPolicyCondition to ResolvedRefs</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.FrontendTLSPolicyConfig">FrontendTLSPolicyConfig
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.FrontendTLSPolicySpec">FrontendTLSPolicySpec</a>)
</p>
<div>
<p>FrontendTLSPolicyConfig defines the policy specification for the Frontend TLS
Policy.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>policyType</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.PolicyType">
PolicyType
</a>
</em>
</td>
<td>
<p>Type is the type of the policy.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.FrontendTLSPolicySpec">FrontendTLSPolicySpec
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.FrontendTLSPolicy">FrontendTLSPolicy</a>)
</p>
<div>
<p>FrontendTLSPolicySpec defines the desired state of FrontendTLSPolicy</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>targetRef</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.CustomTargetRef">
CustomTargetRef
</a>
</em>
</td>
<td>
<p>TargetRef identifies an API object to apply policy to.</p>
</td>
</tr>
<tr>
<td>
<code>default</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.FrontendTLSPolicyConfig">
FrontendTLSPolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Default defines default policy configuration for the targeted resource.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.FrontendTLSPolicyStatus">FrontendTLSPolicyStatus
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.FrontendTLSPolicy">FrontendTLSPolicy</a>)
</p>
<div>
<p>FrontendTLSPolicyStatus defines the observed state of FrontendTLSPolicy.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>conditions</code><br/>
<em>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Condition">
[]Kubernetes meta/v1.Condition
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Conditions describe the current conditions of the FrontendTLSPolicy.</p>
<p>Implementations should prefer to express FrontendTLSPolicy conditions
using the <code>FrontendTLSPolicyConditionType</code> and <code>FrontendTLSPolicyConditionReason</code>
constants so that operators and tools can converge on a common
vocabulary to describe FrontendTLSPolicy state.</p>
<p>Known condition types are:</p>
<ul>
<li>&ldquo;Accepted&rdquo;</li>
<li>&ldquo;Ready&rdquo;</li>
</ul>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.FrontendTLSPolicyType">FrontendTLSPolicyType
(<code>string</code> alias)</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.PolicyType">PolicyType</a>)
</p>
<div>
<p>FrontendTLSPolicyType is the type of the Frontend TLS Policy.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;predefined&#34;</p></td>
<td><p>PredefinedFrontendTLSPolicyType is the type of the predefined Frontend TLS Policy.</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.HTTPMatch">HTTPMatch
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.HTTPSpecifiers">HTTPSpecifiers</a>)
</p>
<div>
<p>HTTPMatch defines the HTTP matchers to use for HealthCheck checks.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>body</code><br/>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Body defines the HTTP body matchers to use for HealthCheck checks.</p>
</td>
</tr>
<tr>
<td>
<code>statusCodes</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.StatusCodes">
[]StatusCodes
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>StatusCodes defines the HTTP status code matchers to use for HealthCheck checks.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.HTTPSpecifiers">HTTPSpecifiers
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.HealthCheckPolicyConfig">HealthCheckPolicyConfig</a>)
</p>
<div>
<p>HTTPSpecifiers defines the schema for HTTP HealthCheck check specification</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>host</code><br/>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Host is the host header value to use for HealthCheck checks.</p>
</td>
</tr>
<tr>
<td>
<code>path</code><br/>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Path is the path to use for HealthCheck checks.</p>
</td>
</tr>
<tr>
<td>
<code>match</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.HTTPMatch">
HTTPMatch
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Match defines the HTTP matchers to use for HealthCheck checks.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.HealthCheckPolicy">HealthCheckPolicy
</h3>
<div>
<p>HealthCheckPolicy is the schema for the HealthCheckPolicy API</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>metadata</code><br/>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta">
Kubernetes meta/v1.ObjectMeta
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Object&rsquo;s metadata.</p>
Refer to the Kubernetes API documentation for the fields of the
<code>metadata</code> field.
</td>
</tr>
<tr>
<td>
<code>spec</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.HealthCheckPolicySpec">
HealthCheckPolicySpec
</a>
</em>
</td>
<td>
<p>Spec is the HealthCheckPolicy specification.</p>
<br/>
<br/>
<table>
<tr>
<td>
<code>targetRef</code><br/>
<em>
<a href="https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.PolicyTargetReference">
Gateway API .PolicyTargetReference
</a>
</em>
</td>
<td>
<p>TargetRef identifies an API object to apply policy to.</p>
</td>
</tr>
<tr>
<td>
<code>override</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.HealthCheckPolicyConfig">
HealthCheckPolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Override defines policy configuration that should override policy
configuration attached below the targeted resource in the hierarchy.</p>
</td>
</tr>
<tr>
<td>
<code>default</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.HealthCheckPolicyConfig">
HealthCheckPolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Default defines default policy configuration for the targeted resource.</p>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td>
<code>status</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.HealthCheckPolicyStatus">
HealthCheckPolicyStatus
</a>
</em>
</td>
<td>
<p>Status defines the current state of HealthCheckPolicy.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.HealthCheckPolicyConditionReason">HealthCheckPolicyConditionReason
(<code>string</code> alias)</h3>
<div>
<p>HealthCheckPolicyConditionReason defines the set of reasons that explain why a
particular HealthCheckPolicy condition type has been raised.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;InvalidReference&#34;</p></td>
<td><p>HealthCheckPolicyInvalidReference is used when the reference is invalid</p>
</td>
</tr><tr><td><p>&#34;Accepted&#34;</p></td>
<td><p>HealthCheckPolicyReasonAccepted is used to set the HealthCheckPolicyConditionReason to Accepted
When the given HealthCheckPolicy is correctly configured</p>
</td>
</tr><tr><td><p>&#34;InvalidHealthCheckPolicy&#34;</p></td>
<td><p>HealthCheckPolicyReasonInvalid is the reason when the HealthCheckPolicy isn't Accepted</p>
</td>
</tr><tr><td><p>&#34;InvalidServiceReference&#34;</p></td>
<td><p>HealthCheckPolicyReasonInvalidServiceReference is used when the service is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidTargetReference&#34;</p></td>
<td><p>HealthCheckPolicyReasonInvalidTargetReference is used when the target is invalid</p>
</td>
</tr><tr><td><p>&#34;NoTargetReference&#34;</p></td>
<td><p>HealthCheckPolicyReasonNoTargetReference is used when the target isn't found</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.HealthCheckPolicyConditionType">HealthCheckPolicyConditionType
(<code>string</code> alias)</h3>
<div>
<p>HealthCheckPolicyConditionType is a type of condition associated with a
HealthCheckPolicy. This type should be used with the HealthCheckPolicyStatus.Conditions
field.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;Accepted&#34;</p></td>
<td><p>HealthCheckPolicyConditionAccepted is used to set the HealthCheckPolicyConditionType to Accepted</p>
</td>
</tr><tr><td><p>&#34;ResolvedRefs&#34;</p></td>
<td><p>HealthCheckPolicyConditionResolvedRefs is used to set the HealthCheckPolicyCondition to ResolvedRefs</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.HealthCheckPolicyConfig">HealthCheckPolicyConfig
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.HealthCheckPolicySpec">HealthCheckPolicySpec</a>, <a href="#alb.networking.azure.io/v1.IngressBackendSettings">IngressBackendSettings</a>)
</p>
<div>
<p>HealthCheckPolicyConfig defines the schema for HealthCheck check specification</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>port</code><br/>
<em>
int32
</em>
</td>
<td>
<em>(Optional)</em>
<p>Port is the port to use for HealthCheck checks.</p>
</td>
</tr>
<tr>
<td>
<code>protocol</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.Protocol">
Protocol
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Protocol is the protocol to use for HealthCheck checks.</p>
</td>
</tr>
<tr>
<td>
<code>interval</code><br/>
<em>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">
Kubernetes meta/v1.Duration
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Interval is the number of seconds between HealthCheck checks.</p>
</td>
</tr>
<tr>
<td>
<code>timeout</code><br/>
<em>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">
Kubernetes meta/v1.Duration
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Timeout is the number of seconds after which the HealthCheck check is
considered failed.</p>
</td>
</tr>
<tr>
<td>
<code>unhealthyThreshold</code><br/>
<em>
int32
</em>
</td>
<td>
<em>(Optional)</em>
<p>UnhealthyThreshold is the number of consecutive failed HealthCheck checks</p>
</td>
</tr>
<tr>
<td>
<code>healthyThreshold</code><br/>
<em>
int32
</em>
</td>
<td>
<em>(Optional)</em>
<p>HealthyThreshold is the number of consecutive successful HealthCheck checks</p>
</td>
</tr>
<tr>
<td>
<code>http</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.HTTPSpecifiers">
HTTPSpecifiers
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>HTTP defines the HTTP constraint specification for the HealthCheck of a
target resource.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.HealthCheckPolicySpec">HealthCheckPolicySpec
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.HealthCheckPolicy">HealthCheckPolicy</a>)
</p>
<div>
<p>HealthCheckPolicySpec defines the desired state of HealthCheckPolicy</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>targetRef</code><br/>
<em>
<a href="https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.PolicyTargetReference">
Gateway API .PolicyTargetReference
</a>
</em>
</td>
<td>
<p>TargetRef identifies an API object to apply policy to.</p>
</td>
</tr>
<tr>
<td>
<code>override</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.HealthCheckPolicyConfig">
HealthCheckPolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Override defines policy configuration that should override policy
configuration attached below the targeted resource in the hierarchy.</p>
</td>
</tr>
<tr>
<td>
<code>default</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.HealthCheckPolicyConfig">
HealthCheckPolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Default defines default policy configuration for the targeted resource.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.HealthCheckPolicyStatus">HealthCheckPolicyStatus
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.HealthCheckPolicy">HealthCheckPolicy</a>)
</p>
<div>
<p>HealthCheckPolicyStatus defines the observed state of HealthCheckPolicy.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>conditions</code><br/>
<em>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Condition">
[]Kubernetes meta/v1.Condition
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Conditions describe the current conditions of the HealthCheckPolicy.</p>
<p>Implementations should prefer to express HealthCheckPolicy conditions
using the <code>HealthCheckPolicyConditionType</code> and <code>HealthCheckPolicyConditionReason</code>
constants so that operators and tools can converge on a common
vocabulary to describe HealthCheckPolicy state.</p>
<p>Known condition types are:</p>
<ul>
<li>&ldquo;Accepted&rdquo;</li>
</ul>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.IngressBackendOverride">IngressBackendOverride
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressListenerSetting">IngressListenerSetting</a>)
</p>
<div>
<p>IngressBackendOverride allows a user to change the hostname on a request before it is sent to a backend service</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>service</code><br/>
<em>
string
</em>
</td>
<td>
<p>Service is the name of a backend service that this override refers to.</p>
</td>
</tr>
<tr>
<td>
<code>backendHost</code><br/>
<em>
string
</em>
</td>
<td>
<p>BackendHost is the hostname that an incoming request will be mutated to use before being forwarded to the backend</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.IngressBackendPort">IngressBackendPort
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressBackendSettings">IngressBackendSettings</a>)
</p>
<div>
<p>IngressBackendPort describes a port on a backend.
Only one of Name/Number should be defined.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>number</code><br/>
<em>
int32
</em>
</td>
<td>
<em>(Optional)</em>
<p>Number indicates the TCP port number being referred to</p>
</td>
</tr>
<tr>
<td>
<code>name</code><br/>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Name must refer to a name on a port on the backend service</p>
</td>
</tr>
<tr>
<td>
<code>protocol</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.Protocol">
Protocol
</a>
</em>
</td>
<td>
<p>Protocol should be one of &ldquo;HTTP&rdquo;, &ldquo;HTTPS&rdquo;</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.IngressBackendSettings">IngressBackendSettings
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressExtensionSpec">IngressExtensionSpec</a>)
</p>
<div>
<p>IngressBackendSettings provides extended configuration options for a backend service</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>service</code><br/>
<em>
string
</em>
</td>
<td>
<p>Service is the name of a backend service that this configuration applies to</p>
</td>
</tr>
<tr>
<td>
<code>ports</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressBackendPort">
[]IngressBackendPort
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Ports can be used to indicate if the backend service is listening on HTTP or HTTPS</p>
</td>
</tr>
<tr>
<td>
<code>trustedRootCertificate</code><br/>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>TrustedRootCertificate can be used to supply a certificate for the gateway to trust when communciating to the
backend on a port specified as https</p>
</td>
</tr>
<tr>
<td>
<code>pathPrefixOverride</code><br/>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>PathPrefixOverride will mutate requests going to the backend to be prefixed with this value</p>
</td>
</tr>
<tr>
<td>
<code>sessionAffinity</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.SessionAffinity">
SessionAffinity
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>SessionAffinity allows client requests to be consistently given to the same backend</p>
</td>
</tr>
<tr>
<td>
<code>timeouts</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressTimeouts">
IngressTimeouts
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Timeouts define a set of timeout parameters to be applied to an Ingress</p>
</td>
</tr>
<tr>
<td>
<code>healthCheck</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.HealthCheckPolicyConfig">
HealthCheckPolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>HealthCheck defines a health probe which is used to determine if a backend is healthy</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.IngressCertificate">IngressCertificate
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressListenerTLS">IngressListenerTLS</a>)
</p>
<div>
<p>IngressCertificate defines a certificate and private key to be used with TLS.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>type</code><br/>
<em>
string
</em>
</td>
<td>
<p>Type indicates where the Certificate is stored.
Can be KubernetesSecret, or KeyVaultCertificate</p>
</td>
</tr>
<tr>
<td>
<code>name</code><br/>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Name is the name of a KubernetesSecret containing the TLS cert and key</p>
</td>
</tr>
<tr>
<td>
<code>secretId</code><br/>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>SecretID is the resource ID of a KeyVaultCertificate</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.IngressExtension">IngressExtension
</h3>
<div>
<p>IngressExtension is the schema for the IngressExtension API</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>metadata</code><br/>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta">
Kubernetes meta/v1.ObjectMeta
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Object&rsquo;s metadata.</p>
Refer to the Kubernetes API documentation for the fields of the
<code>metadata</code> field.
</td>
</tr>
<tr>
<td>
<code>spec</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressExtensionSpec">
IngressExtensionSpec
</a>
</em>
</td>
<td>
<p>Spec is the IngressExtension specification.</p>
<br/>
<br/>
<table>
<tr>
<td>
<code>listenerSettings</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressListenerSetting">
[]IngressListenerSetting
</a>
</em>
</td>
<td>
<p>Listeners defines a list of listeners to configure</p>
</td>
</tr>
<tr>
<td>
<code>backendSettings</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressBackendSettings">
[]IngressBackendSettings
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>BackendSettings defines a set of configuration options for Ingress service backends</p>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.IngressExtensionSpec">IngressExtensionSpec
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressExtension">IngressExtension</a>)
</p>
<div>
<p>IngressExtensionSpec defines the desired configuration of IngressExtension</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>listenerSettings</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressListenerSetting">
[]IngressListenerSetting
</a>
</em>
</td>
<td>
<p>Listeners defines a list of listeners to configure</p>
</td>
</tr>
<tr>
<td>
<code>backendSettings</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressBackendSettings">
[]IngressBackendSettings
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>BackendSettings defines a set of configuration options for Ingress service backends</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.IngressListenerPort">IngressListenerPort
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressListenerSetting">IngressListenerSetting</a>)
</p>
<div>
<p>IngressListenerPort describes a port a listener will listen on.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>port</code><br/>
<em>
int32
</em>
</td>
<td>
<p>Port defines what TCP port the listener will listen on</p>
</td>
</tr>
<tr>
<td>
<code>protocol</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.Protocol">
Protocol
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Protocol indicates if the port will be used for HTTP or HTTPS traffic.</p>
</td>
</tr>
<tr>
<td>
<code>sslRedirectTo</code><br/>
<em>
int32
</em>
</td>
<td>
<em>(Optional)</em>
<p>SSLRedirectTo can be used to redirect HTTP traffic to HTTPS on the indicated port</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.IngressListenerSetting">IngressListenerSetting
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressExtensionSpec">IngressExtensionSpec</a>)
</p>
<div>
<p>IngressListenerSetting provides configuration options for listeners</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>host</code><br/>
<em>
string
</em>
</td>
<td>
<p>Host is used to match against Ingress rules with the same hostname in order to identify which rules are affected by these settings</p>
</td>
</tr>
<tr>
<td>
<code>tls</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressListenerTLS">
IngressListenerTLS
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>TLS defines TLS settings for the Listener</p>
</td>
</tr>
<tr>
<td>
<code>additionalHostnames</code><br/>
<em>
[]string
</em>
</td>
<td>
<em>(Optional)</em>
<p>AdditionalHostnames specifies additional hostnames to listen on</p>
</td>
</tr>
<tr>
<td>
<code>ports</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressListenerPort">
[]IngressListenerPort
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Defines what ports and protocols a listener should listen on</p>
</td>
</tr>
<tr>
<td>
<code>overrideBackendHostnames</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressBackendOverride">
[]IngressBackendOverride
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>OverrideBackendHostnames is a list of services on which incoming requests will have the value of the host header changed</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.IngressListenerTLS">IngressListenerTLS
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressListenerSetting">IngressListenerSetting</a>)
</p>
<div>
<p>IngressListenerTLS provides options for configuring TLS settings on a listener</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>certificate</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressCertificate">
IngressCertificate
</a>
</em>
</td>
<td>
<p>Certificate specifies a TLS Certificate to configure a Listener with</p>
</td>
</tr>
<tr>
<td>
<code>policy</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressTLSPolicy">
IngressTLSPolicy
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Policy configures a particular TLS Policy</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.IngressTLSPolicy">IngressTLSPolicy
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressListenerTLS">IngressListenerTLS</a>)
</p>
<div>
<p>IngressTLSPolicy describes cipher suites and related TLS configuration options</p>
</div>
<h3 id="alb.networking.azure.io/v1.IngressTimeouts">IngressTimeouts
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressBackendSettings">IngressBackendSettings</a>)
</p>
<div>
<p>IngressTimeouts can be used to configure timeout properties for an Ingress</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>requestTimeout</code><br/>
<em>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">
Kubernetes meta/v1.Duration
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>RequestTimeout defines the timeout used by the load balancer when forwarding requests to a backend service</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.PolicyType">PolicyType
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.FrontendTLSPolicyConfig">FrontendTLSPolicyConfig</a>)
</p>
<div>
<p>PolicyType is the type of the policy.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>name</code><br/>
<em>
string
</em>
</td>
<td>
<p>Name is the name of the policy.</p>
</td>
</tr>
<tr>
<td>
<code>type</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.FrontendTLSPolicyType">
FrontendTLSPolicyType
</a>
</em>
</td>
<td>
<p>PredefinedFrontendTLSPolicyType is the type of the predefined Frontend TLS Policy.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.Protocol">Protocol
(<code>string</code> alias)</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.HealthCheckPolicyConfig">HealthCheckPolicyConfig</a>, <a href="#alb.networking.azure.io/v1.IngressBackendPort">IngressBackendPort</a>, <a href="#alb.networking.azure.io/v1.IngressListenerPort">IngressListenerPort</a>)
</p>
<div>
<p>Protocol defines the protocol used for certain properties.
Valid Protocol values are:</p>
<ul>
<li>HTTP</li>
<li>HTTPS</li>
<li>TCP</li>
</ul>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;HTTP&#34;</p></td>
<td><p>HTTP implies that the service will use HTTP</p>
</td>
</tr><tr><td><p>&#34;HTTPS&#34;</p></td>
<td><p>HTTPS implies that the service will be use HTTPS</p>
</td>
</tr><tr><td><p>&#34;TCP&#34;</p></td>
<td><p>TCP implies that the service will be use plain TCP</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.RoutePolicy">RoutePolicy
</h3>
<div>
<p>RoutePolicy is the schema for the RoutePolicy API</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>metadata</code><br/>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta">
Kubernetes meta/v1.ObjectMeta
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Object&rsquo;s metadata.</p>
Refer to the Kubernetes API documentation for the fields of the
<code>metadata</code> field.
</td>
</tr>
<tr>
<td>
<code>spec</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.RoutePolicySpec">
RoutePolicySpec
</a>
</em>
</td>
<td>
<p>Spec is the RoutePolicy specification.</p>
<br/>
<br/>
<table>
<tr>
<td>
<code>targetRef</code><br/>
<em>
<a href="https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.PolicyTargetReference">
Gateway API .PolicyTargetReference
</a>
</em>
</td>
<td>
<p>TargetRef identifies an API object to apply policy to.</p>
</td>
</tr>
<tr>
<td>
<code>override</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.RoutePolicyConfig">
RoutePolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Override defines policy configuration that should override policy
configuration attached below the targeted resource in the hierarchy.</p>
</td>
</tr>
<tr>
<td>
<code>default</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.RoutePolicyConfig">
RoutePolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Default defines default policy configuration for the targeted resource.</p>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td>
<code>status</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.RoutePolicyStatus">
RoutePolicyStatus
</a>
</em>
</td>
<td>
<p>Status defines the current state of RoutePolicy.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.RoutePolicyConditionReason">RoutePolicyConditionReason
(<code>string</code> alias)</h3>
<div>
<p>RoutePolicyConditionReason defines the set of reasons that explain why a
particular RoutePolicy condition type has been raised.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;Accepted&#34;</p></td>
<td><p>RoutePolicyReasonAccepted is used to set the RoutePolicyConditionReason to Accepted
When the given RoutePolicy is correctly configured</p>
</td>
</tr><tr><td><p>&#34;InvalidRoutePolicy&#34;</p></td>
<td><p>RoutePolicyReasonInvalid is the reason when the RoutePolicy isn't Accepted</p>
</td>
</tr><tr><td><p>&#34;InvalidHTTPRoute&#34;</p></td>
<td><p>RoutePolicyReasonInvalidHTTPRoute is used when the HTTPRoute is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidTargetReference&#34;</p></td>
<td><p>RoutePolicyReasonInvalidTargetReference is used when there is no target reference</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.RoutePolicyConditionType">RoutePolicyConditionType
(<code>string</code> alias)</h3>
<div>
<p>RoutePolicyConditionType is a type of condition associated with a
RoutePolicy. This type should be used with the RoutePolicyStatus.Conditions
field.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;Accepted&#34;</p></td>
<td><p>RoutePolicyConditionAccepted is used to set the RoutePolicyConditionType to Accepted</p>
</td>
</tr><tr><td><p>&#34;ResolvedRefs&#34;</p></td>
<td><p>RoutePolicyConditionResolvedRefs is used to set the RoutePolicyCondition to ResolvedRefs</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.RoutePolicyConfig">RoutePolicyConfig
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.RoutePolicySpec">RoutePolicySpec</a>)
</p>
<div>
<p>RoutePolicyConfig defines the schema for RoutePolicy specification. This allows the specification of the following attributes:
* Timeouts
* Session Affinity</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>timeouts</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.RouteTimeouts">
RouteTimeouts
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Custom Timeouts
Timeout for the target resource.</p>
</td>
</tr>
<tr>
<td>
<code>sessionAffinity</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.SessionAffinity">
SessionAffinity
</a>
</em>
</td>
<td>
<p>SessionAffinity defines the schema for Session Affinity specification</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.RoutePolicySpec">RoutePolicySpec
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.RoutePolicy">RoutePolicy</a>)
</p>
<div>
<p>RoutePolicySpec defines the desired state of RoutePolicy</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>targetRef</code><br/>
<em>
<a href="https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.PolicyTargetReference">
Gateway API .PolicyTargetReference
</a>
</em>
</td>
<td>
<p>TargetRef identifies an API object to apply policy to.</p>
</td>
</tr>
<tr>
<td>
<code>override</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.RoutePolicyConfig">
RoutePolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Override defines policy configuration that should override policy
configuration attached below the targeted resource in the hierarchy.</p>
</td>
</tr>
<tr>
<td>
<code>default</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.RoutePolicyConfig">
RoutePolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Default defines default policy configuration for the targeted resource.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.RoutePolicyStatus">RoutePolicyStatus
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.RoutePolicy">RoutePolicy</a>)
</p>
<div>
<p>RoutePolicyStatus defines the observed state of RoutePolicy.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>conditions</code><br/>
<em>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Condition">
[]Kubernetes meta/v1.Condition
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Conditions describe the current conditions of the RoutePolicy.</p>
<p>Implementations should prefer to express RoutePolicy conditions
using the <code>RoutePolicyConditionType</code> and <code>RoutePolicyConditionReason</code>
constants so that operators and tools can converge on a common
vocabulary to describe RoutePolicy state.</p>
<p>Known condition types are:</p>
<ul>
<li>&ldquo;Accepted&rdquo;</li>
</ul>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.RouteTimeouts">RouteTimeouts
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.RoutePolicyConfig">RoutePolicyConfig</a>)
</p>
<div>
<p>RouteTimeouts defines the schema for Timeouts specification</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>routeTimeout</code><br/>
<em>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">
Kubernetes meta/v1.Duration
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>RouteTimeout is the timeout for the route.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.SessionAffinity">SessionAffinity
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressBackendSettings">IngressBackendSettings</a>, <a href="#alb.networking.azure.io/v1.RoutePolicyConfig">RoutePolicyConfig</a>)
</p>
<div>
<p>SessionAffinity defines the schema for Session Affinity specification</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>affinityType</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.AffinityType">
AffinityType
</a>
</em>
</td>
<td>
</td>
</tr>
<tr>
<td>
<code>cookieName</code><br/>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
</td>
</tr>
<tr>
<td>
<code>cookieDuration</code><br/>
<em>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">
Kubernetes meta/v1.Duration
</a>
</em>
</td>
<td>
<em>(Optional)</em>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.StatusCodes">StatusCodes
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.HTTPMatch">HTTPMatch</a>)
</p>
<div>
<p>StatusCodes defines the HTTP status code matchers to use for HealthCheck checks.</p>
</div>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>start</code><br/>
<em>
int32
</em>
</td>
<td>
<em>(Optional)</em>
<p>Start defines the start of the range of status codes to use for HealthCheck checks.</p>
</td>
</tr>
<tr>
<td>
<code>end</code><br/>
<em>
int32
</em>
</td>
<td>
<em>(Optional)</em>
<p>End defines the end of the range of status codes to use for HealthCheck checks.</p>
</td>
</tr>
</tbody>
</table>
