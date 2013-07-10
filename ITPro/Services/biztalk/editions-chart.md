<properties linkid="editions-chart" urlDisplayName="BizTalk Services Editions" pageTitle="BizTalk Services: Developer, Basic, Standard and Enterprise Editions Chart" metaKeywords="Get started Azure biztalk services, editions, Azure unstructured data" metaDescription="A chart that lists the differences with the different Windows Azure BizTalk Services editions." metaCanonical="http://www.windowsazure.com/en-us/manage/services/biztalk-services/editions-chart" umbracoNaviHide="0" disqusComments="1" writer="mandia" editor="susanjo" manager="paulettm" /> 

<div chunk="../chunks/biztalk-services-left-nav.md"/> 

# BizTalk Services: Developer, Basic, Standard and Premium Editions Chart

Windows Azure BizTalk Services offers four editions: Developer, Basic, Standard, and Premium. The following table lists the differences:

<table border="1">
<tr bgcolor="FAF9F9">
        <td>-</td>
        <td><strong>Developer</strong></td>
        <td><strong>Basic</strong></td>
        <td><strong>Standard</strong></td>
        <td><strong>Premium</strong></td>
</tr>
<tr>
<td><strong>Starting price</strong></td>
<td>Refer to <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=304011"> Windows Azure BizTalk Services Pricing</a>.</td>
<td>Refer to <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=304011"> Windows Azure BizTalk Services Pricing</a>.</td>
<td>Refer to <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=304011"> Windows Azure BizTalk Services Pricing</a>.</td>
<td>Refer to <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=304011"> Windows Azure BizTalk Services Pricing</a>.</td>
</tr>
<tr>
<td><strong>Target Users</strong></td>
<td>Use to develop applications and with trial scenarios. Easy way to create solutions with low cost. Not used in a production environment.</td>
<td>Use in the simplest scenarios, especially among new users and current Windows Azure users.</td>
<td>Ideal for Enterprise and Independent Software Vendors (ISV) who need basic functionality.</td>
<td>Ideal for Enterprise and Independent Software Vendors (ISV) who need robust functionality.</td>
</tr>
<tr>
<td><strong>Default Minimum Configuration</strong></td>
<td>1 Developer Unit</td>
<td>1 Basic Unit</td>
<td>1 Standard Unit</td>
<td>1 Premium Unit</td>
</tr>
<tr>
<td><strong>Scale Out</strong></td>
<td>No Scale</td>
<td>No Scale</td>
<td>Yes, in increments of 1 Standard unit</td>
<td>Yes, in increments of 1 Premium unit</td>
</tr>
<tr>
<td><strong>Maximum Allowed Scale Out</strong></td>
<td>No Scale</td>
<td>No Scale</td>
<td>4 Units</td>
<td>8 Units</td>
</tr>
<tr>
<td><strong>Deployed BizTalk Service projects</strong></td>
<td>For the number of  Bridge files, refer to <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=304011"> Windows Azure BizTalk Services Pricing</a>.</td>
<td>For the number of  Bridge files, refer to <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=304011"> Windows Azure BizTalk Services Pricing</a>.</td>
<td>For the number of  Bridge files, refer to <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=304011"> Windows Azure BizTalk Services Pricing</a>.</td>
<td>For the number of  Bridge files, refer to <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=304011"> Windows Azure BizTalk Services Pricing</a>.</td>
</tr>
<tr>
<td><strong>EDI</strong></td>
<td>Included. For the number of  Agreements, refer to <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=304011"> Windows Azure BizTalk Services Pricing</a>.</td>
<td>No EDI functionality</td>
<td>No EDI functionality</td>
<td>Included. For the number of  Agreements, refer to <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=304011"> Windows Azure BizTalk Services Pricing</a>.</td>
</tr>
<tr>
<td><strong>Basic message processing (HTTP to HTTP)</strong></td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
</tr>
<tr>
<td><strong>BizTalk Adapter Service connections to on-premise LOB systems</strong></td>
<td>1 connection</td>
<td>0 connections</td>
<td>5 connections</td>
<td>25 connections</td>
</tr>
<tr>
<td><strong>Supported protocols:</strong>
<bl>
<li>HTTP</li>
<li>HTTPS</li>
<li>FTP</li>
<li>SFTP</li>
<li>WCF</li>
<li>Service Bus (SB)</li>
<li>REST APIs</li>
</bl>
</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
</tr>
<tr>
<td><strong>High Availability</strong></td>
<td>Not included; no Service Level Agreement (SLA) requirements</td>
<td>Refer to <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=304011"> Windows Azure BizTalk Services Pricing</a>.
<!--99.9% SLA, including downtime for platform upgrades--></td>
<td>Refer to <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=304011"> Windows Azure BizTalk Services Pricing</a>.
<!--99.9% SLA, including downtime for platform upgrades--></td>
<td>Refer to <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=304011"> Windows Azure BizTalk Services Pricing</a>.
<!--99.9% SLA, including downtime for platform upgrades--></td>
</tr>
<tr>
<td><strong>Stores Tracking data</strong></td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
</tr>
<tr>
<td><strong>Stores archived data</strong></td>
<td>Included</td>
<td>Not Included</td>
<td>Not Included</td>
<td>Included</td>
</tr>
<tr>
<td><strong>Use of Custom Code</strong></td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
</tr>
<tr>
<td><strong>Use of Transforms, including XSLT</strong></td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
</tr>
</table>

A "unit" is the atomic level of a Windows Azure BizTalk Services deployment. Each edition comes with a unit that has different compute capacity and memory. A Basic Unit has twice the compute as Developer. Standard has twice the compute as Basic. Enterprise has twice the compute as Standard. When you scale BizTalk Service, you scale in terms of Units.

## Next

To provision Windows Azure BizTalk Services in the Windows Azure Management Portal, go to [BizTalk Services: Provisioning Using Windows Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=302280). To start creating applications, go to [Windows Azure BizTalk Services - June 2013 Preview](http://go.microsoft.com/fwlink/p/?LinkID=235197).

## See Also
[BizTalk Services: Developer, Basic, Standard and Premium Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279)<br/>
[BizTalk Services: Provisioning Using Windows Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=302280)<br/>
[BizTalk Services: Throttling](http://go.microsoft.com/fwlink/p/?LinkID=302282)<br/>
[BizTalk Services: Issuer Name and Issuer Key](http://go.microsoft.com/fwlink/p/?LinkID=303941)<br/>
[How do I Start Using the Windows Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)<br/>