---

title: Application Gateway for Containers API Specification for Kubernetes
description: This article provides documentation for Application Gateway for Containers' API specification for Kubernetes.
services: application-gateway
author: greg-lindsay
ms.service: azure-appgw-for-containers
ms.topic: concept-article
ms.date: 9/16/2024
ms.author: greglin
---

# Application Gateway for Containers API specification for Kubernetes

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
why a particular condition type are raised by the Application Gateway for Containers resource.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;Accepted&#34;</p></td>
<td><p>AlbReasonAccepted indicates that the Application Gateway for Containers resource
are accepted by the controller.</p>
</td>
</tr><tr><td><p>&#34;Ready&#34;</p></td>
<td><p>AlbReasonDeploymentReady indicates the Application Gateway for Containers resource
deployment status.</p>
</td>
</tr><tr><td><p>&#34;InProgress&#34;</p></td>
<td><p>AlbReasonInProgress indicates whether the Application Gateway for Containers resource
is in the process of being created, updated, or deleted.</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.AlbConditionType">AlbConditionType
(<code>string</code> alias)</h3>
<div>
<p>AlbConditionType is a type of condition associated with an
Application Gateway for Containers resource. This type should be used with the AlbStatus.Conditions
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
are accepted by the controller.</p>
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
<p>AlbSpec defines the specifications for the Application Gateway for Containers resource.</p>
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
<p>Associations are subnet resource IDs the Application Gateway for Containers resource are associated with.</p>
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
<p>Associations are subnet resource IDs the Application Gateway for Containers resource are associated with.</p>
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
<p>BackendTLSPolicy is the schema for the BackendTLSPolicys API.</p>
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
<p>Note: Override is currently not supported and result in a validation error.
Support for Override will be added in a future release.</p>
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
particular BackendTLSPolicy condition type is raised.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;Accepted&#34;</p></td>
<td><p>BackendTLSPolicyReasonAccepted is used to set the BackendTLSPolicyConditionReason to Accepted
When the given BackendTLSPolicy is correctly configured</p>
</td>
</tr><tr><td><p>&#34;InvalidBackendTLSPolicy&#34;</p></td>
<td><p>BackendTLSPolicyReasonInvalid is the reason when the BackendTLSPolicy isn&rsquo;t Accepted</p>
</td>
</tr><tr><td><p>&#34;InvalidCertificateRef&#34;</p></td>
<td><p>BackendTLSPolicyReasonInvalidCertificateRef is used when an invalid certificate is referenced</p>
</td>
</tr><tr><td><p>&#34;InvalidGroup&#34;</p></td>
<td><p>BackendTLSPolicyReasonInvalidGroup is used when the group is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidKind&#34;</p></td>
<td><p>BackendTLSPolicyReasonInvalidKind is used when the kind/group is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidName&#34;</p></td>
<td><p>BackendTLSPolicyReasonInvalidName is used when the name is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidSecret&#34;</p></td>
<td><p>BackendTLSPolicyReasonInvalidSecret is used when the Secret is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidService&#34;</p></td>
<td><p>BackendTLSPolicyReasonInvalidService is used when the Service is invalid</p>
</td>
</tr><tr><td><p>&#34;NoTargetReference&#34;</p></td>
<td><p>BackendTLSPolicyReasonNoTargetReference is used when there&rsquo;s no target reference</p>
</td>
</tr><tr><td><p>&#34;OverrideNotSupported&#34;</p></td>
<td><p>BackendTLSPolicyReasonOverrideNotSupported is used when the override isn&rsquo;t supported</p>
</td>
</tr><tr><td><p>&#34;RefNotPermitted&#34;</p></td>
<td><p>BackendTLSPolicyReasonRefNotPermitted is used when the ref isn&rsquo;t permitted</p>
</td>
</tr><tr><td><p>&#34;SectionNamesNotPermitted&#34;</p></td>
<td><p>BackendTLSPolicyReasonSectionNamesNotPermitted is used when the section names aren&rsquo;t permitted</p>
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
<td><p>BackendTLSPolicyConditionAccepted is used to set the BackendTLSPolicyConditionType to Accepted</p>
</td>
</tr><tr><td><p>&#34;ResolvedRefs&#34;</p></td>
<td><p>BackendTLSPolicyConditionResolvedRefs is used to set the BackendTLSPolicyCondition to ResolvedRefs</p>
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
<a href="https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1.SecretObjectReference">
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
<p>BackendTLSPolicySpec defines the desired state of BackendTLSPolicy.</p>
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
<p>Note: Override is currently not supported and result in a validation error.
Support for Override will be added in a future release.</p>
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
<p>CommonTLSPolicy is the schema for the CommonTLSPolicy API.</p>
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
<p>Verify provides the options to verify the peer certificate.</p>
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
<p>CommonTLSPolicyVerify defines the schema for the CommonTLSPolicyVerify API.</p>
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
<a href="https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1.SecretObjectReference">
Gateway API .SecretObjectReference
</a>
</em>
</td>
<td>
<p>CaCertificateRef is the CA certificate used to verify peer certificate.</p>
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
<em>(Optional)</em>
<p>SubjectAltName is the subject alternative name used to verify peer
certificate.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.CustomTargetRef">CustomTargetRef
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.BackendTLSPolicySpec">BackendTLSPolicySpec</a>, <a href="#alb.networking.azure.io/v1.FrontendTLSPolicySpec">FrontendTLSPolicySpec</a>, <a href="#alb.networking.azure.io/v1.HealthCheckPolicySpec">HealthCheckPolicySpec</a>, <a href="#alb.networking.azure.io/v1.RoutePolicySpec">RoutePolicySpec</a>)
</p>
<div>
<p>CustomTargetRef is a reference to a custom resource that isn&rsquo;t part of the
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
<code>NamespacedPolicyTargetReference</code><br/>
<em>
<a href="https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1alpha2.NamespacedPolicyTargetReference">
Gateway API alpha2.NamespacedPolicyTargetReference
</a>
</em>
</td>
<td>
<p>
(Members of <code>NamespacedPolicyTargetReference</code> are embedded into this type.)
</p>
</td>
</tr>
<tr>
<td>
<code>sectionNames</code><br/>
<em>
[]string
</em>
</td>
<td>
<em>(Optional)</em>
<p>SectionNames is the name of the section within the target resource. When
unspecified, this targetRef targets the entire resource. In the following
resources, SectionNames is interpreted as the following:</p>
<ul>
<li>Gateway: Listener Name</li>
<li>Service: Port Name</li>
</ul>
<p>If a SectionNames is specified, but doesn&rsquo;t exist on the targeted object,
the Policy fails to attach, and the policy implementation will record
a <code>ResolvedRefs</code> or similar Condition in the Policy&rsquo;s status.</p>
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
<tr>
<td>
<code>override</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.FrontendTLSPolicyConfig">
FrontendTLSPolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Override defines policy configuration that should override policy
configuration attached below the targeted resource in the hierarchy.</p>
<p>Note: Override is currently not supported and result in a validation error.
Support for Override will be added in a future release.</p>
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
particular FrontendTLSPolicy condition type is raised.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;Accepted&#34;</p></td>
<td><p>FrontendTLSPolicyReasonAccepted is used to set the FrontendTLSPolicyConditionReason to Accepted
When the given FrontendTLSPolicy is correctly configured</p>
</td>
</tr><tr><td><p>&#34;InvalidFrontendTLSPolicy&#34;</p></td>
<td><p>FrontendTLSPolicyReasonInvalid is the reason when the FrontendTLSPolicy isn&rsquo;t Accepted</p>
</td>
</tr><tr><td><p>&#34;InvalidCertificateRef&#34;</p></td>
<td><p>FrontendTLSPolicyReasonInvalidCertificateRef is used when an invalid certificate is referenced</p>
</td>
</tr><tr><td><p>&#34;InvalidDefault&#34;</p></td>
<td><p>FrontendTLSPolicyReasonInvalidDefault is used when the default is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidGateway&#34;</p></td>
<td><p>FrontendTLSPolicyReasonInvalidGateway is used when the gateway is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidGroup&#34;</p></td>
<td><p>FrontendTLSPolicyReasonInvalidGroup is used when the group is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidKind&#34;</p></td>
<td><p>FrontendTLSPolicyReasonInvalidKind is used when the kind/group is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidName&#34;</p></td>
<td><p>FrontendTLSPolicyReasonInvalidName is used when the name is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidPolicyName&#34;</p></td>
<td><p>FrontendTLSPolicyReasonInvalidPolicyName is used when the policy name is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidPolicyType&#34;</p></td>
<td><p>FrontendTLSPolicyReasonInvalidPolicyType is used when the policy type is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidTargetReference&#34;</p></td>
<td><p>FrontendTLSPolicyReasonInvalidTargetReference is used when the target reference is invalid</p>
</td>
</tr><tr><td><p>&#34;NoTargetReference&#34;</p></td>
<td><p>FrontendTLSPolicyReasonNoTargetReference is used when there&rsquo;s no target reference</p>
</td>
</tr><tr><td><p>&#34;OverrideNotSupported&#34;</p></td>
<td><p>FrontendTLSPolicyReasonOverrideNotSupported is used when the override isn&rsquo;t supported</p>
</td>
</tr><tr><td><p>&#34;RefNotPermitted&#34;</p></td>
<td><p>FrontendTLSPolicyReasonRefNotPermitted is used when the ref isn&rsquo;t permitted</p>
</td>
</tr><tr><td><p>&#34;SectionNamesNotPermitted&#34;</p></td>
<td><p>FrontendTLSPolicyReasonSectionNamesNotPermitted is used when the section names aren&rsquo;t permitted</p>
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
<code>verify</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.MTLSPolicyVerify">
MTLSPolicyVerify
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Verify provides the options to verify the peer certificate.</p>
</td>
</tr>
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
<em>(Optional)</em>
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
<tr>
<td>
<code>override</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.FrontendTLSPolicyConfig">
FrontendTLSPolicyConfig
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Override defines policy configuration that should override policy
configuration attached below the targeted resource in the hierarchy.</p>
<p>Note: Override is currently not supported and result in a validation error.
Support for Override will be added in a future release.</p>
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
<h3 id="alb.networking.azure.io/v1.FrontendTLSPolicyTypeName">FrontendTLSPolicyTypeName
(<code>string</code> alias)</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.PolicyType">PolicyType</a>)
</p>
<div>
<p>FrontendTLSPolicyTypeName is the name of the Frontend TLS Policy.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;2023-06&#34;</p></td>
<td><p>PredefinedPolicy202306 is the name of the predefined Frontend TLS Policy for the policy &ldquo;2023-06&rdquo;.</p>
</td>
</tr><tr><td><p>&#34;2023-06-S&#34;</p></td>
<td><p>PredefinedPolicy202306Strict is the name of the predefined Frontend TLS Policy for the policy &ldquo;2023-06-S&rdquo;.
This is a strict version of the policy &ldquo;2023-06&rdquo;.</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.GRPCSpecifiers">GRPCSpecifiers
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.HealthCheckPolicyConfig">HealthCheckPolicyConfig</a>)
</p>
<div>
<p>GRPCSpecifiers defines the schema for GRPC HealthCheck.</p>
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
<code>authority</code><br/>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Authority if present is used as the value of the Authority header in the health check.</p>
</td>
</tr>
<tr>
<td>
<code>service</code><br/>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Service allows the configuration of a Health check registered under a different service name.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.HTTPHeader">HTTPHeader
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.HeaderFilter">HeaderFilter</a>)
</p>
<div>
<p>HTTPHeader represents an HTTP Header name and value as defined by RFC 7230.</p>
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
<a href="#alb.networking.azure.io/v1.HTTPHeaderName">
HTTPHeaderName
</a>
</em>
</td>
<td>
<p>Name is the name of the HTTP Header to be matched. Name matching MUST be
case insensitive. (See <a href="https://tools.ietf.org/html/rfc7230#section-3.2">https://tools.ietf.org/html/rfc7230#section-3.2</a>).</p>
<p>If multiple entries specify equivalent header names, the first entry with
an equivalent name MUST be considered for a match. Subsequent entries
with an equivalent header name MUST be ignored. Due to the
case-insensitivity of header names, &ldquo;foo&rdquo; and &ldquo;Foo&rdquo; are considered
equivalent.</p>
</td>
</tr>
<tr>
<td>
<code>value</code><br/>
<em>
string
</em>
</td>
<td>
<p>Value is the value of HTTP Header to be matched.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.HTTPHeaderName">HTTPHeaderName
(<code>string</code> alias)</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.HTTPHeader">HTTPHeader</a>)
</p>
<div>
<p>HTTPHeaderName is the name of an HTTP header.</p>
<p>Valid values include:</p>
<ul>
<li>&ldquo;Authorization&rdquo;</li>
<li>&ldquo;Set-Cookie&rdquo;</li>
</ul>
<p>Invalid values include:</p>
<ul>
<li>&rdquo;:method&rdquo; - &ldquo;:&rdquo; is an invalid character. This means that HTTP/2 pseudo
headers aren&rsquo;t currently supported by this type.</li>
<li>&rdquo;/invalid&rdquo; - &ldquo;/ &rdquo; is an invalid character</li>
</ul>
</div>
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
<h3 id="alb.networking.azure.io/v1.HTTPPathModifier">HTTPPathModifier
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.Redirect">Redirect</a>, <a href="#alb.networking.azure.io/v1.URLRewriteFilter">URLRewriteFilter</a>)
</p>
<div>
<p>HTTPPathModifier defines configuration for path modifiers.</p>
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
<a href="#alb.networking.azure.io/v1.HTTPPathModifierType">
HTTPPathModifierType
</a>
</em>
</td>
<td>
<p>Type defines the type of path modifier. More types may be
added in a future release of the API.</p>
<p>Values may be added to this enum, implementations
must ensure unknown values won&rsquo;t cause a crash.</p>
<p>Unknown values here must result in the implementation setting the
Accepted Condition for the rule to be false</p>
</td>
</tr>
<tr>
<td>
<code>replaceFullPath</code><br/>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>ReplaceFullPath specifies the value with which to replace the full path
of a request during a rewrite or redirect.</p>
</td>
</tr>
<tr>
<td>
<code>replacePrefixMatch</code><br/>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>ReplacePrefixMatch specifies the value with which to replace the prefix
match of a request during a rewrite or redirect. For example, a request
to &ldquo;/foo/bar&rdquo; with a prefix match of &ldquo;/foo&rdquo; and a ReplacePrefixMatch
of &ldquo;/xyz&rdquo; would be modified to &ldquo;/xyz/bar&rdquo;.</p>
<p>This matches the behavior of the PathPrefix match type. This
matches full path elements. A path element refers to the list of labels
in the path split by the <code>/</code> separator. When specified, a trailing <code>/</code> is
ignored. For example, the paths <code>/abc</code>, <code>/abc/</code>, and <code>/abc/def</code> would all
match the prefix <code>/abc</code>, but the path <code>/abcd</code> wouldn&rsquo;t.</p>
<p>ReplacePrefixMatch is only compatible with a <code>PathPrefix</code> HTTPRouteMatch.
Using any other HTTPRouteMatch type on the same HTTPRouteRule results in
the implementation setting the Accepted Condition for the Route to <code>status: False</code>.</p>
<table>
<thead>
<tr>
<th>Request Path</th>
<th>Prefix Match</th>
<th>Replace Prefix</th>
<th>Modified Path</th>
</tr>
</thead>
<tbody>
<tr>
<td>/foo/bar</td>
<td>/foo</td>
<td>/xyz</td>
<td>/xyz/bar</td>
</tr>
<tr>
<td>/foo/bar</td>
<td>/foo</td>
<td>/xyz/</td>
<td>/xyz/bar</td>
</tr>
<tr>
<td>/foo/bar</td>
<td>/foo/</td>
<td>/xyz</td>
<td>/xyz/bar</td>
</tr>
<tr>
<td>/foo/bar</td>
<td>/foo/</td>
<td>/xyz/</td>
<td>/xyz/bar</td>
</tr>
<tr>
<td>/foo</td>
<td>/foo</td>
<td>/xyz</td>
<td>/xyz</td>
</tr>
<tr>
<td>/foo/</td>
<td>/foo</td>
<td>/xyz</td>
<td>/xyz/</td>
</tr>
<tr>
<td>/foo/bar</td>
<td>/foo</td>
<td></td>
<td>/bar</td>
</tr>
<tr>
<td>/foo/</td>
<td>/foo</td>
<td></td>
<td>/</td>
</tr>
<tr>
<td>/foo</td>
<td>/foo</td>
<td></td>
<td>/</td>
</tr>
<tr>
<td>/foo/</td>
<td>/foo</td>
<td>/</td>
<td>/</td>
</tr>
<tr>
<td>/foo</td>
<td>/foo</td>
<td>/</td>
<td>/</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.HTTPPathModifierType">HTTPPathModifierType
(<code>string</code> alias)</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.HTTPPathModifier">HTTPPathModifier</a>)
</p>
<div>
<p>HTTPPathModifierType defines the type of path redirect or rewrite.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;ReplaceFullPath&#34;</p></td>
<td><p>FullPathHTTPPathModifier replaces the full path with the specified value.</p>
</td>
</tr><tr><td><p>&#34;ReplacePrefixMatch&#34;</p></td>
<td><p>PrefixMatchHTTPPathModifier replaces any prefix path with the
substitution value. For example, a path with a prefix
match of &ldquo;/foo&rdquo; and a ReplacePrefixMatch substitution of &ldquo;/bar&rdquo;
replace &ldquo;/foo&rdquo; with &ldquo;/bar&rdquo; in matching requests.</p>
<p>This matches the behavior of the PathPrefix match type. This
matches full path elements. A path element refers to the list of labels
in the path split by the <code>/</code> separator. When specified, a trailing <code>/</code> is
ignored. For example, the paths <code>/abc</code>, <code>/abc/</code>, and <code>/abc/def</code> would all
match the prefix <code>/abc</code>, but the path <code>/abcd</code> wouldn&rsquo;t.</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.HTTPSpecifiers">HTTPSpecifiers
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.HealthCheckPolicyConfig">HealthCheckPolicyConfig</a>)
</p>
<div>
<p>HTTPSpecifiers defines the schema for HTTP HealthCheck check specification.</p>
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
<h3 id="alb.networking.azure.io/v1.HeaderFilter">HeaderFilter
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressRewrites">IngressRewrites</a>)
</p>
<div>
<p>HeaderFilter defines a filter that modifies the headers of an HTTP
request or response. Only one action for a given header name is permitted.
Filters specifying multiple actions of the same or different type for any one
header name are invalid and rejected.
Configuration to set or add multiple values for a header must use RFC 7230
header value formatting, separating each value with a comma.</p>
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
<code>set</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.HTTPHeader">
[]HTTPHeader
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Set overwrites the request with the given header (name, value)
before the action.</p>
<p>Input:
GET /foo HTTP/1.1
my-header: foo</p>
<p>Config:
set:
- name: &ldquo;my-header&rdquo;
value: &ldquo;bar&rdquo;</p>
<p>Output:
GET /foo HTTP/1.1
my-header: bar</p>
</td>
</tr>
<tr>
<td>
<code>add</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.HTTPHeader">
[]HTTPHeader
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Add adds the given header(s) (name, value) to the request
before the action. It appends to any existing values associated
with the header name.</p>
<p>Input:
GET /foo HTTP/1.1
my-header: foo</p>
<p>Config:
add:
- name: &ldquo;my-header&rdquo;
value: &ldquo;bar,baz&rdquo;</p>
<p>Output:
GET /foo HTTP/1.1
my-header: foo,bar,baz</p>
</td>
</tr>
<tr>
<td>
<code>remove</code><br/>
<em>
[]string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Remove the given header(s) from the HTTP request before the action. The
value of Remove is a list of HTTP header names. Header names
are case-insensitive (see
<a href="https://datatracker.ietf.org/doc/html/rfc2616#section-4.2)">https://datatracker.ietf.org/doc/html/rfc2616#section-4.2)</a>.</p>
<p>Input:
GET /foo HTTP/1.1
my-header1: foo
my-header2: bar
my-header3: baz</p>
<p>Config:
remove: [&ldquo;my-header1&rdquo;, &ldquo;my-header3&rdquo;]</p>
<p>Output:
GET /foo HTTP/1.1
my-header2: bar</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.HeaderName">HeaderName
(<code>string</code> alias)</h3>
<div>
<p>HeaderName is the name of a header or query parameter.</p>
</div>
<h3 id="alb.networking.azure.io/v1.HealthCheckPolicy">HealthCheckPolicy</h3>
<div>
<p>HealthCheckPolicy is the schema for the HealthCheckPolicy API.</p>
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
<p>Note: Override is currently not supported and will result in a validation error.
Support for Override will be added in a future release.</p>
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
particular HealthCheckPolicy condition type is raised.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;BackendTLSPolicyNotFound&#34;</p></td>
<td><p>BackendTLSPolicyConditionNotFound is used when the BackendTLSPolicy is not found for the service.</p>
</td>
</tr><tr><td><p>&#34;Accepted&#34;</p></td>
<td><p>HealthCheckPolicyReasonAccepted is used to set the HealthCheckPolicyConditionReason to Accepted.
When the given HealthCheckPolicy is correctly configured.</p>
</td>
</tr><tr><td><p>&#34;InvalidHealthCheckPolicy&#34;</p></td>
<td><p>HealthCheckPolicyReasonInvalid is the reason when the HealthCheckPolicy isn&rsquo;t Accepted.</p>
</td>
</tr><tr><td><p>&#34;InvalidGroup&#34;</p></td>
<td><p>HealthCheckPolicyReasonInvalidGroup is used when the group is invalid.</p>
</td>
</tr><tr><td><p>&#34;InvalidKind&#34;</p></td>
<td><p>HealthCheckPolicyReasonInvalidKind is used when the kind/group is invalid.</p>
</td>
</tr><tr><td><p>&#34;InvalidName&#34;</p></td>
<td><p>HealthCheckPolicyReasonInvalidName is used when the name is invalid.</p>
</td>
</tr><tr><td><p>&#34;InvalidPort&#34;</p></td>
<td><p>HealthCheckPolicyReasonInvalidPort is used when the port is invalid.</p>
</td>
</tr><tr><td><p>&#34;InvalidService&#34;</p></td>
<td><p>HealthCheckPolicyReasonInvalidService is used when the Service is invalid.</p>
</td>
</tr><tr><td><p>&#34;NoTargetReference&#34;</p></td>
<td><p>HealthCheckPolicyReasonNoTargetReference is used when there&rsquo;s no target reference.</p>
</td>
</tr><tr><td><p>&#34;OverrideNotSupported&#34;</p></td>
<td><p>HealthCheckPolicyReasonOverrideNotSupported is used when the override isn&rsquo;t supported.</p>
</td>
</tr><tr><td><p>&#34;RefNotPermitted&#34;</p></td>
<td><p>HealthCheckPolicyReasonRefNotPermitted is used when the ref isn&rsquo;t permitted.</p>
</td>
</tr><tr><td><p>&#34;SectionNamesNotPermitted&#34;</p></td>
<td><p>HealthCheckPolicyReasonSectionNamesNotPermitted is used when the section names aren&rsquo;t permitted.</p>
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
<td><p>HealthCheckPolicyConditionAccepted is used to set the HealthCheckPolicyConditionType to Accepted.</p>
</td>
</tr><tr><td><p>&#34;ResolvedRefs&#34;</p></td>
<td><p>HealthCheckPolicyConditionResolvedRefs is used to set the HealthCheckPolicyCondition to ResolvedRefs.</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.HealthCheckPolicyConfig">HealthCheckPolicyConfig
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.HealthCheckPolicySpec">HealthCheckPolicySpec</a>)
</p>
<div>
<p>HealthCheckPolicyConfig defines the schema for HealthCheck check specification.</p>
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
<code>unhealthyThreshold</code><br/>
<em>
int32
</em>
</td>
<td>
<em>(Optional)</em>
<p>UnhealthyThreshold is the number of consecutive failed HealthCheck checks.</p>
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
<p>HealthyThreshold is the number of consecutive successful HealthCheck checks.</p>
</td>
</tr>
<tr>
<td>
<code>useTLS</code><br/>
<em>
bool
</em>
</td>
<td>
<em>(Optional)</em>
<p>UseTLS indicates whether health check should enforce TLS.
By default, health check will use the same protocol as the
service if the same port is used for health check. If the port
is different, health check will be plaintext.</p>
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
<tr>
<td>
<code>grpc</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.GRPCSpecifiers">
GRPCSpecifiers
</a>
</em>
</td>
<td>
<p>GRPC configures a gRPC v1 HealthCheck (<a href="https://github.com/grpc/grpc-proto/blob/master/grpc/health/v1/health.proto">https://github.com/grpc/grpc-proto/blob/master/grpc/health/v1/health.proto</a>)
against the target resource.</p>
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
<p>HealthCheckPolicySpec defines the desired state of HealthCheckPolicy.</p>
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
<p>Note: Override is currently not supported and will result in a validation error.
Support for Override will be added in a future release.</p>
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
<code>port</code><br/>
<em>
int32
</em>
</td>
<td>
<em>(Optional)</em>
<p>Port indicates the port  on the backend service</p>
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
<h3 id="alb.networking.azure.io/v1.IngressBackendSettingStatus">IngressBackendSettingStatus
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressExtensionStatus">IngressExtensionStatus</a>)
</p>
<div>
<p>IngressBackendSettingStatus describes the state of a BackendSetting</p>
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
<p>Service identifies the BackendSetting this status describes</p>
</td>
</tr>
<tr>
<td>
<code>validationErrors</code><br/>
<em>
[]string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Errors are a list of errors relating to this setting</p>
</td>
</tr>
<tr>
<td>
<code>valid</code><br/>
<em>
bool
</em>
</td>
<td>
<p>Valid indicates that there are no validation errors present on this BackendSetting</p>
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
<p>TrustedRootCertificate can be used to supply a certificate for the gateway to trust when communicating to the
backend on a port specified as https</p>
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
<code>rules</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressRuleSetting">
[]IngressRuleSetting
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Rules define the rules per host</p>
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
<tr>
<td>
<code>status</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressExtensionStatus">
IngressExtensionStatus
</a>
</em>
</td>
<td>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.IngressExtensionConditionReason">IngressExtensionConditionReason
(<code>string</code> alias)</h3>
<div>
<p>IngressExtensionConditionReason defines the set of reasons that explain why a
particular IngressExtension condition type is raised.</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;Accepted&#34;</p></td>
<td><p>IngressExtensionReasonAccepted is used to set the IngressExtensionConditionAccepted to Accepted</p>
</td>
</tr><tr><td><p>&#34;HasValidationErrors&#34;</p></td>
<td><p>IngressExtensionReasonHasErrors indicates there are some validation errors</p>
</td>
</tr><tr><td><p>&#34;NoValidationErrors&#34;</p></td>
<td><p>IngressExtensionReasonNoErrors indicates there are no validation errors</p>
</td>
</tr><tr><td><p>&#34;PartiallyAcceptedWithErrors&#34;</p></td>
<td><p>IngressExtensionReasonPartiallyAccepted is used to set the IngressExtensionConditionAccepted to Accepted, but with nonfatal validation errors</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.IngressExtensionConditionType">IngressExtensionConditionType
(<code>string</code> alias)</h3>
<div>
<p>IngressExtensionConditionType is a type of condition associated with a
IngressExtension. This type should be used with the IngressExtensionStatus.Conditions
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
<td><p>IngressExtensionConditionAccepted indicates if the IngressExtension is accepted (reconciled) by the controller</p>
</td>
</tr><tr><td><p>&#34;Errors&#34;</p></td>
<td><p>IngressExtensionConditionErrors indicates if there are validation or build errors on the extension</p>
</td>
</tr></tbody>
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
<code>rules</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressRuleSetting">
[]IngressRuleSetting
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Rules define the rules per host</p>
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
<h3 id="alb.networking.azure.io/v1.IngressExtensionStatus">IngressExtensionStatus
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressExtension">IngressExtension</a>)
</p>
<div>
<p>IngressExtensionStatus describes the current state of the IngressExtension</p>
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
<code>rules</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressRuleStatus">
[]IngressRuleStatus
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Rules have detailed status information regarding each Rule</p>
</td>
</tr>
<tr>
<td>
<code>backendSettings</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressBackendSettingStatus">
[]IngressBackendSettingStatus
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>BackendSettings has detailed status information regarding each BackendSettings</p>
</td>
</tr>
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
<p>Conditions describe the current conditions of the IngressExtension.
Known condition types are:</p>
<ul>
<li>&ldquo;Accepted&rdquo;</li>
<li>&ldquo;Errors&rdquo;</li>
</ul>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.IngressRewrites">IngressRewrites
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressRuleSetting">IngressRuleSetting</a>)
</p>
<div>
<p>IngressRewrites provides the various rewrites supported on a rule</p>
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
<a href="#alb.networking.azure.io/v1.RewriteType">
RewriteType
</a>
</em>
</td>
<td>
<p>Type identifies the type of rewrite</p>
</td>
</tr>
<tr>
<td>
<code>requestHeaderModifier</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.HeaderFilter">
HeaderFilter
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>RequestHeaderModifier defines a schema that modifies request headers.</p>
</td>
</tr>
<tr>
<td>
<code>responseHeaderModifier</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.HeaderFilter">
HeaderFilter
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>RequestHeaderModifier defines a schema that modifies response headers.</p>
</td>
</tr>
<tr>
<td>
<code>urlRewrite</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.URLRewriteFilter">
URLRewriteFilter
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>URLRewrite defines a schema that modifies a request during forwarding.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.IngressRuleSetting">IngressRuleSetting
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressExtensionSpec">IngressExtensionSpec</a>)
</p>
<div>
<p>IngressRuleSetting provides configuration options for rules</p>
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
<p>Host is used to match against Ingress rules with the same hostname in order to identify which rules affect these settings</p>
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
<p>AdditionalHostnames specifies more hostnames to listen on</p>
</td>
</tr>
<tr>
<td>
<code>rewrites</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.IngressRewrites">
[]IngressRewrites
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Rewrites defines the rewrites for the rule</p>
</td>
</tr>
<tr>
<td>
<code>requestRedirect</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.Redirect">
Redirect
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>RequestRedirect defines the redirect behavior for the rule</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.IngressRuleStatus">IngressRuleStatus
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressExtensionStatus">IngressExtensionStatus</a>)
</p>
<div>
<p>IngressRuleStatus describes the state of a rule</p>
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
<p>Host identifies the rule this status describes</p>
</td>
</tr>
<tr>
<td>
<code>validationErrors</code><br/>
<em>
[]string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Errors are a list of errors relating to this setting</p>
</td>
</tr>
<tr>
<td>
<code>valid</code><br/>
<em>
bool
</em>
</td>
<td>
<em>(Optional)</em>
<p>Valid indicates that there are no validation errors present on this rule</p>
</td>
</tr>
</tbody>
</table>
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
<h3 id="alb.networking.azure.io/v1.MTLSPolicyVerify">MTLSPolicyVerify
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.FrontendTLSPolicyConfig">FrontendTLSPolicyConfig</a>)
</p>
<div>
<p>MTLSPolicyVerify defines the schema for the MTLSPolicyVerify API.</p>
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
<a href="https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1.SecretObjectReference">
Gateway API .SecretObjectReference
</a>
</em>
</td>
<td>
<p>CaCertificateRef is the CA certificate used to verify peer certificate.</p>
</td>
</tr>
<tr>
<td>
<code>subjectAltNames</code><br/>
<em>
[]string
</em>
</td>
<td>
<em>(Optional)</em>
<p>SubjectAltNames is the list of subject alternative names used to verify peer
certificate.</p>
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
<a href="#alb.networking.azure.io/v1.FrontendTLSPolicyTypeName">
FrontendTLSPolicyTypeName
</a>
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
<h3 id="alb.networking.azure.io/v1.PortNumber">PortNumber
(<code>int32</code> alias)</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.Redirect">Redirect</a>)
</p>
<div>
<p>PortNumber defines a network port.</p>
</div>
<h3 id="alb.networking.azure.io/v1.PreciseHostname">PreciseHostname
(<code>string</code> alias)</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.Redirect">Redirect</a>, <a href="#alb.networking.azure.io/v1.URLRewriteFilter">URLRewriteFilter</a>)
</p>
<div>
<p>PreciseHostname is the fully qualified domain name of a network host. This
matches the RFC 1123 definition of a hostname with one notable exception that
numeric IP addresses aren&rsquo;t allowed.</p>
<p>Per RFC1035 and RFC1123, a <em>label</em> must consist of lower case
alphanumeric characters or &lsquo;-&rsquo;, and must start and end with an alphanumeric
character. No other punctuation is allowed.</p>
</div>
<h3 id="alb.networking.azure.io/v1.Protocol">Protocol
(<code>string</code> alias)</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressBackendPort">IngressBackendPort</a>)
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
<td><p>ProtocolHTTP implies that the service uses HTTP.</p>
</td>
</tr><tr><td><p>&#34;HTTPS&#34;</p></td>
<td><p>ProtocolHTTPS implies that the service uses HTTPS.</p>
</td>
</tr><tr><td><p>&#34;TCP&#34;</p></td>
<td><p>ProtocolTCP implies that the service uses plain TCP.</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.Redirect">Redirect
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressRuleSetting">IngressRuleSetting</a>)
</p>
<div>
<p>Redirect defines a filter that redirects a request. This
MUST NOT be used on the same rule that also has a URLRewriteFilter.</p>
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
<code>scheme</code><br/>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Scheme is the scheme to be used in the value of the <code>Location</code> header in
the response. When empty, the scheme of the request is used.</p>
</td>
</tr>
<tr>
<td>
<code>hostname</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.PreciseHostname">
PreciseHostname
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Hostname is the hostname to be used in the value of the <code>Location</code>
header in the response.
When empty, the hostname in the <code>Host</code> header of the request is used.</p>
</td>
</tr>
<tr>
<td>
<code>path</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.HTTPPathModifier">
HTTPPathModifier
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Path defines parameters used to modify the path of the incoming request.
The modified path is then used to construct the <code>Location</code> header. When
empty, the request path is used as-is.</p>
</td>
</tr>
<tr>
<td>
<code>port</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.PortNumber">
PortNumber
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Port is the port to be used in the value of the <code>Location</code>
header in the response.</p>
<p>If no port is specified, the redirect port MUST be derived using the
following rules:</p>
<ul>
<li>If redirect scheme is not-empty, the redirect port MUST be the well-known
port associated with the redirect scheme. Specifically &ldquo;http&rdquo; to port 80
and &ldquo;https&rdquo; to port 443. If the redirect scheme doesn&rsquo;t have a
well-known port, the listener port of the Gateway SHOULD be used.</li>
<li>If redirect scheme is empty, the redirect port MUST be the Gateway
Listener port.</li>
</ul>
<p>Implementations SHOULD NOT add the port number in the &lsquo;Location&rsquo;
header in the following cases:</p>
<ul>
<li>A Location header that uses HTTP (whether that is determined via
the Listener protocol or the Scheme field) <em>and</em> use port 80.</li>
<li>A Location header that uses HTTPS (whether that is determined via
the Listener protocol or the Scheme field) <em>and</em> use port 443.</li>
</ul>
</td>
</tr>
<tr>
<td>
<code>statusCode</code><br/>
<em>
int
</em>
</td>
<td>
<em>(Optional)</em>
<p>StatusCode is the HTTP status code to be used in response.</p>
<p>Values may be added to this enum, implementations
must ensure that unknown values won&rsquo;t cause a crash.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.RewriteType">RewriteType
(<code>string</code> alias)</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressRewrites">IngressRewrites</a>)
</p>
<div>
<p>RewriteType identifies the rewrite type</p>
</div>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody><tr><td><p>&#34;RequestHeaderModifier&#34;</p></td>
<td><p>RequestHeaderModifier can be used to add or remove an HTTP
header from an HTTP request before it&rsquo;s sent to the upstream target.</p>
</td>
</tr><tr><td><p>&#34;ResponseHeaderModifier&#34;</p></td>
<td><p>ResponseHeaderModifier can be used to add or remove an HTTP
header from an HTTP response before it&rsquo;s sent to the client.</p>
</td>
</tr><tr><td><p>&#34;URLRewrite&#34;</p></td>
<td><p>URLRewrite can be used to modify a request during forwarding.</p>
</td>
</tr></tbody>
</table>
<h3 id="alb.networking.azure.io/v1.RoutePolicy">RoutePolicy
</h3>
<div>
<p>RoutePolicy is the schema for the RoutePolicy API.</p>
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
<p>Note: Override is currently not supported and result in a validation error.
Support for Override will be added in a future release.</p>
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
particular RoutePolicy condition type is raised.</p>
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
<td><p>RoutePolicyReasonInvalid is the reason when the RoutePolicy isn&rsquo;t Accepted</p>
</td>
</tr><tr><td><p>&#34;InvalidGRPCRoute&#34;</p></td>
<td><p>RoutePolicyReasonInvalidGRPCRoute is used when the GRPCRoute is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidGroup&#34;</p></td>
<td><p>RoutePolicyReasonInvalidGroup is used when the group is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidHTTPRoute&#34;</p></td>
<td><p>RoutePolicyReasonInvalidHTTPRoute is used when the HTTPRoute is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidKind&#34;</p></td>
<td><p>RoutePolicyReasonInvalidKind is used when the kind/group is invalid</p>
</td>
</tr><tr><td><p>&#34;InvalidName&#34;</p></td>
<td><p>RoutePolicyReasonInvalidName is used when the name is invalid</p>
</td>
</tr><tr><td><p>&#34;NoTargetReference&#34;</p></td>
<td><p>RoutePolicyReasonNoTargetReference is used when there&rsquo;s no target reference</p>
</td>
</tr><tr><td><p>&#34;OverrideNotSupported&#34;</p></td>
<td><p>RoutePolicyReasonOverrideNotSupported is used when the override isn&rsquo;t supported</p>
</td>
</tr><tr><td><p>&#34;RefNotPermitted&#34;</p></td>
<td><p>RoutePolicyReasonRefNotPermitted is used when the ref isn&rsquo;t permitted</p>
</td>
</tr><tr><td><p>&#34;SectionNamesNotPermitted&#34;</p></td>
<td><p>RoutePolicyReasonSectionNamesNotPermitted is used when the section names aren&rsquo;t permitted</p>
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
<p>RoutePolicyConfig defines the schema for RoutePolicy specification.
This allows the specification of the following attributes:
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
<p>RoutePolicySpec defines the desired state of RoutePolicy.</p>
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
<p>Note: Override is currently not supported and result in a validation error.
Support for Override will be added in a future release.</p>
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
<p>RouteTimeouts defines the schema for Timeouts specification.</p>
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
<p>SessionAffinity defines the schema for Session Affinity specification.</p>
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
<p>Start defines the start of the range of status codes to use for HealthCheck checks.
This is inclusive.</p>
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
<p>End defines the end of the range of status codes to use for HealthCheck checks.
This is inclusive.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="alb.networking.azure.io/v1.URLRewriteFilter">URLRewriteFilter
</h3>
<p>
(<em>Appears on:</em><a href="#alb.networking.azure.io/v1.IngressRewrites">IngressRewrites</a>)
</p>
<div>
<p>URLRewriteFilter defines a filter that modifies a request during
forwarding. At most one of these filters may be used on a rule. This
MUST NOT be used on the same rule having an sslRedirect.</p>
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
<code>hostname</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.PreciseHostname">
PreciseHostname
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Hostname is the value to be used to replace the Host header value during
forwarding.</p>
</td>
</tr>
<tr>
<td>
<code>path</code><br/>
<em>
<a href="#alb.networking.azure.io/v1.HTTPPathModifier">
HTTPPathModifier
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Path defines a path rewrite.</p>
</td>
</tr>
</tbody>
</table>
