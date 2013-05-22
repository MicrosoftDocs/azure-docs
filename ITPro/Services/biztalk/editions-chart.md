# **BizTalk Services: Developer, Basic, Standard and Enterprise Editions Chart**

Windows Azure BizTalk Services offers four editions: Developer, Basic, Standard, and Premium. The following table lists the differences:

<table border>
<tr bgcolor="FAF9F9">
        <td></td>
        <td><b>Developer</td>
        <td><b>Basic</td>
        <td><b>Standard</td>
        <td><b>Premium</td>
</tr>
<tr>
<td>Starting price</td>
<td>$100 per month per unit: Prorate hourly at $0.13 per hour</td>
<td>$500 per month per unit: Prorate hourly at $0.67 per hour</td>
<td>$3000 per month per unit: Prorate hourly at $4.03 per hour</td>
<td>$6000 per month per unit: Prorate hourly at $8.06 per hour</td>
</tr>
<tr>
<td>Target Users</td>
<td>Use to develop applications and with trial scenarios. Easy way to create solutions with low cost. Not used in a production environment.</td>
<td>Use in the simplest scenarios, especially among new users and current Windows Azure users.</td>
<td>Ideal for Enterprise and Independent Software Vendors (ISV) who need basic functionality.</td>
<td>Ideal for Enterprise and Independent Software Vendors (ISV) who need robust functionality.</td>
</tr>
<tr>
<td>Default Minimum Configuration</td>
<td>1 Developer Unit</td>
<td>1 Basic Unit</td>
<td>1 Standard Unit</td>
<td>1 Premium Unit</td>
</tr>
<tr>
<td>Scale Out</td>
<td>No Scale</td>
<td>No Scale</td>
<td>Yes, in increments of 1 Standard unit</td>
<td>Yes, in increments of 1 Premium unit</td>
</tr>
<tr>
<td>Maximum Allowed Scale Out</td>
<td>No Scale</td>
<td>No Scale</td>
<td>4 Units</td>
<td>8 Units</td>
</tr>
<tr>
<td>Deployed BizTalk Service projects</td>
<td>25 bridge files per unit</td>
<td>25 bridge files per unit</td>
<td>250 bridge files per unit</td>
<td>500 bridge files per unit</td>
</tr>
<tr>
<td>EDI</td>
<td>Included. Maximum of 12 Agreements per unit.</td>
<td>No EDI functionality</td>
<td>No EDI functionality</td>
<td>Included. Maximum of 250 Agreements per unit.</td>
</tr>
<tr>
<td>Basic message processing (HTTP to HTTP)</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
</tr>
<tr>
<td>BizTalk Adapter Service connections to on-premise LOB systems</td>
<td>1 connection</td>
<td>0 connections</td>
<td>5 connections</td>
<td>25 connections</td>
</tr>
<tr>
<td>Supported protocols:

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
<td>High Availability</td>
<td>Not included; no Service Level Agreement (SLA) requirements</td>
<td>99.9% SLA, including downtime for platform upgrades</td>
<td>99.9% SLA, including downtime for platform upgrades</td>
<td>99.9% SLA, including downtime for platform upgrades</td>
</tr>
<tr>
<td>Stores Tracking data</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
</tr>
<tr>
<td>Stores archived data</td>
<td>Included</td>
<td>Not Included</td>
<td>Not Included</td>
<td>Included</td>
</tr>Included<tr>
<td>Use of Custom Code</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
</tr>Included<tr>
<td>Use of Transforms, including XSLT</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
</tr>
</table>

A “unit” is the atomic level of a Windows Azure BizTalk Services deployment. Each edition comes with a unit that has different compute capacity and memory. A Basic Unit has twice the compute as Developer. Standard has twice the compute as Basic. Enterprise has twice the compute as Standard. When you scale BizTalk Service, you scale in terms of Units.

## **Next**

To provision Windows Azure BizTalk Services in the Windows Azure Management Portal, go to [BizTalk Services: Provisioning Using Windows Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=302280). To start creating applications, go to [Windows Azure BizTalk Services - June 2013 Preview](http://go.microsoft.com/fwlink/p/?LinkID=235197).

## **See Also**
[BizTalk Services: Developer, Basic, Standard and Premium Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279)<br>
[BizTalk Services: Provisioning Using Windows Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=302280)<br>
[BizTalk Services: Throttling](http://go.microsoft.com/fwlink/p/?LinkID=302282)<br>
[BizTalk Services: Issuer Name and Issuer Key](http://go.microsoft.com/fwlink/p/?LinkID=303941)<br>
[How do I Start Using the Windows Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)<br>