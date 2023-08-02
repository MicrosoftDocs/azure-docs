---
title: Azure network round-trip latency statistics
description: Learn about round-trip latency statistics between Azure regions.
services: networking
author: mbender-ms
ms.service: virtual-network
ms.topic: article
ms.date: 07/21/2023
ms.author: mbender
ms.custom: references_regions
---

# Azure network round-trip latency statistics

Azure continuously monitors the latency (speed) of core areas of its network using internal monitoring tools and measurements.

## How are the measurements collected?

The latency measurements are collected from Azure cloud regions worldwide, and continuously measured in 1-minute intervals by network probes. The monthly latency statistics are derived from averaging the collected samples for the month.

## Round-trip latency figures

The monthly Percentile P50 round trip times between Azure regions for a 30-day window are shown in the following tabs. The latency is measured in milliseconds (ms).

The current dataset was taken on *July 21st, 2023*, and it covers the 30-day period from *June 21st, 2023* to *July 21st, 2023*.

> [!IMPORTANT]
> Monthly latency numbers across Azure regions do not change on a regular basis. You can expect an update of these tables every 6 to 9 months. Not all public Azure regions are listed in the tables below. When new regions come online, we will update this document as soon as latency data is available.
> 
> You can perform VM-to-VM latency between regions using [test Virtual Machines](../virtual-network/virtual-network-test-latency.md) in your Azure subscription.

#### [North America / South America](#tab/Americas)

Listing of Americas regions including US, Canada, and Brazil.

#### [Europe](#tab/Europe)

Listing of European regions.

#### [Asia / Pacific](#tab/AsiaPacific)

Listing of Asia / Pacific regions including Japan, Korea, India, and Australia.


#### [Middle East / Africa](#tab/MiddleEast)

Listing of Middle East / Africa regions including UAE, South Africa, and Qatar.

---

#### [West US](#tab/WestUS/Americas)

|Source|West US|West US 2|West US 3|
|---|---|---|---|
|Australia Central|144|164|158|
|Australia Central 2|144|164|158|
|Australia East|148|160|156|
|Australia Southeast|159|171|167|
|Brazil South|180|182|163|
|Canada Central|61|63|65|
|Canada East|69|73|73|
|Central India|218|210|232|
|Central US|39|38|43|
|East Asia|149|141|151|
|East US|64|64|51|
|East US 2|60|64|47|
|France Central|142|142|130|
|France South|151|149|140|
|Germany North|155|152|143|
|Germany West Central|147|145|135|
|Japan East|106|98|108|
|Japan West|113|105|115|
|Korea Central|130|123|135|
|Korea South|123|116|125|
|North Central US|49|47|51|
|North Europe|132|130|119|
|Norway East|160|157|147|
|Norway West|164|162|150|
|Qatar Central|264|261|250|
|South Africa North|312|309|296|
|South Africa West|294|291|277|
|South Central US|34|45|20|
|South India|202|195|217|
|Southeast Asia|169|162|175|
|Sweden Central|170|168|159|
|Switzerland North|153|151|142|
|Switzerland West|149|148|138|
|UAE Central|258|254|238|
|UAE North|258|256|239|
|UK South|136|134|124|
|UK West|139|137|128|
|West Central US|25|24|31|
|West Europe|147|145|134|
|West India|221|210|233|
|West US||23|17|
|West US 2|23||38|
|West US 3|17|37||

#### [Central US](#tab/CentralUS/Americas)

|Source|North Central US|Central US|South Central US|West Central US|
|---|---|---|---|---|
|Australia Central|193|180|175|167|
|Australia Central 2|193|181|176|167|
|Australia East|188|176|173|167|
|Australia Southeast|197|188|184|178|
|Brazil South|136|147|141|161|
|Canada Central|17|23|48|38|
|Canada East|26|31|58|46|
|Central India|223|235|237|241|
|Central US|9||26|16|
|East Asia|186|177|168|163|
|East US|19|24|32|43|
|East US 2|22|28|28|45|
|France Central|97|104|112|120|
|France South|108|113|122|128|
|Germany North|111|116|125|131|
|Germany West Central|103|109|117|124|
|Japan East|142|134|125|120|
|Japan West|148|141|132|127|
|Korea Central|165|158|152|144|
|Korea South|164|153|142|138|
|North Central US||9|33|26|
|North Europe|85|94|98|108|
|Norway East|115|122|130|135|
|Norway West|115|127|131|141|
|Qatar Central|215|227|226|240|
|South Africa North|263|274|275|287|
|South Africa West|245|256|259|270|
|South Central US|33|26||24|
|South India|247|230|234|216|
|Southeast Asia|205|197|192|184|
|Sweden Central|126|132|141|150|
|Switzerland North|109|115|124|130|
|Switzerland West|106|112|121|126|
|UAE Central|209|221|215|234|
|UAE North|210|222|215|235|
|UK South|91|98|106|112|
|UK West|95|100|110|116|
|West Central US|25|16|24||
|West Europe|100|109|113|123|
|West India|220|232|231|242|
|West US|49|39|34|25|
|West US 2|47|38|45|24|
|West US 3|50|43|20|31|


#### [East US](#tab/EastUS/Americas)

|Source|East US|East US 2|
|---|---|---|
|Australia Central|213|208|
|Australia Central 2|213|209|
|Australia East|204|200|
|Australia Southeast|216|211|
|Brazil South|116|114|
|Canada Central|18|22|
|Canada East|27|31|
|Central India|203|203|
|Central US|24|27|
|East Asia|199|195|
|East US||6|
|East US 2|7||
|France Central|82|85|
|France South|92|96|
|Germany North|94|98|
|Germany West Central|87|91|
|Japan East|156|151|
|Japan West|163|158|
|Korea Central|184|184|
|Korea South|181|175|
|North Central US|19|22|
|North Europe|67|71|
|Norway East|100|104|
|Norway West|96|99|
|Qatar Central|195|196|
|South Africa North|243|248|
|South Africa West|225|228|
|South Central US|33|28|
|South India|235|233|
|Southeast Asia|223|220|
|Sweden Central|110|115|
|Switzerland North|94|98|
|Switzerland West|91|94|
|UAE Central|189|187|
|UAE North|190|188|
|UK South|76|80|
|UK West|80|84|
|West Central US|42|43|
|West Europe|82|86|
|West India|201|201|
|West US|64|60|
|West US 2|64|64|
|West US 3|51|46|

#### [Canada / Brazil](#tab/Canada/Americas)

|Source|Brazil</br>South|Canada</br>Central|Canada</br>East|
|---|---|---|---|
|Australia Central|323|204|212|
|Australia Central 2|323|204|212|
|Australia East|319|197|205|
|Australia Southeast|329|209|217|
|Brazil South||129|137|
|Canada Central|128||12|
|Canada East|137|13||
|Central India|305|216|224|
|Central US|147|24|31|
|East Asia|328|198|206|
|East US|115|18|26|
|East US 2|114|22|31|
|France Central|183|98|108|
|France South|193|110|118|
|Germany North|195|112|121|
|Germany West Central|189|105|114|
|Japan East|275|154|162|
|Japan West|285|162|170|
|Korea Central|301|179|187|
|Korea South|296|175|183|
|North Central US|135|18|26|
|North Europe|170|83|92|
|Norway East|203|117|126|
|Norway West|197|107|117|
|Qatar Central|296|207|215|
|South Africa North|345|256|264|
|South Africa West|326|237|245|
|South Central US|141|48|57|
|South India|337|252|260|
|Southeast Asia|340|218|226|
|Sweden Central|206|129|137|
|Switzerland North|196|111|120|
|Switzerland West|192|108|117|
|UAE Central|291|201|210|
|UAE North|292|202|211|
|UK South|177|93|102|
|UK West|180|97|106|
|West Central US|161|42|46|
|West Europe|183|97|106|
|West India|302|213|221|
|West US|179|62|69|
|West US 2|182|64|73|
|West US 3|162|66|73|

#### [Australia](#tab/Australia/AsiaPacific)

| Source | Australia</br>Central | Australia</br>Central 2 | Australia</br>East | Australia</br>Southeast |
|--------|-------------------|---------------------|----------------|---------------------|
| Australia Central |   | 2 | 8 | 14 |
| Australia Central 2 | 2 |   | 8 | 14 |
| Australia East | 7 | 8 |   | 14 |
| Australia Southeast | 14 | 14 | 14 |   |
| Brazil South | 323 | 323 | 319 | 330 |
| Canada Central | 203 | 204 | 197 | 209 |
| Canada East | 212 | 212 | 205 | 217 |
| Central India | 144 | 144 | 140 | 133 |
| Central US | 180 | 181 | 176 | 188 |
| East Asia | 125 | 126 | 123 | 117 |
| East US | 213 | 213 | 204 | 216 |
| East US 2 | 208 | 209 | 200 | 212 |
| France Central | 237 | 238 | 232 | 230 |
| France South | 227 | 227 | 222 | 219 |
| Germany North | 249 | 249 | 244 | 241 |
| Germany West Central | 242 | 242 | 237 | 234 |
| Japan East | 127 | 127 | 101 | 113 |
| Japan West | 135 | 135 | 109 | 120 |
| Korea Central | 152 | 152 | 129 | 141 |
| Korea South | 144 | 144 | 139 | 148 |
| North Central US | 193 | 193 | 188 | 197 |
| North Europe | 251 | 251 | 246 | 243 |
| Norway East | 262 | 262 | 257 | 254 |
| Norway West | 258 | 258 | 253 | 250 |
| Qatar Central | 190 | 191 | 186 | 183 |
| South Africa North | 383 | 384 | 378 | 375 |
| South Africa West | 399 | 399 | 394 | 391 |
| South Central US | 175 | 175 | 173 | 184 |
| South India | 126 | 126 | 121 | 118 |
| Southeast Asia | 94 | 94 | 89 | 83 |
| Sweden Central | 265 | 266 | 261 | 258 |
| Switzerland North | 237 | 237 | 232 | 230 |
| Switzerland West | 234 | 234 | 229 | 226 |
| UAE Central | 170 | 170 | 167 | 161 |
| UAE North | 170 | 171 | 167 | 162 |
| UK South | 242 | 243 | 238 | 235 |
| UK West | 245 | 245 | 240 | 237 |
| West Central US | 166 | 166 | 169 | 180 |
| West Europe | 244 | 245 | 239 | 237 |
| West India | 145 | 145 | 141 | 137 |
| West US | 143 | 144 | 148 | 160 |
| West US 2 | 164 | 164 | 160 | 172 |
| West US 3 | 158 | 158 | 156 | 167 |

#### [Japan](#tab/Japan/AsiaPacific)

|Source|Japan East|Japan West|
|---|---|---|
|Australia Central|127|134|
|Australia Central 2|127|135|
|Australia East|102|109|
|Australia Southeast|113|120|
|Brazil South|275|283|
|Canada Central|154|161|
|Canada East|163|170|
|Central India|118|125|
|Central US|134|141|
|East Asia|46|47|
|East US|156|162|
|East US 2|152|158|
|France Central|212|225|
|France South|202|215|
|Germany North|224|238|
|Germany West Central|217|231|
|Japan East||10|
|Japan West|10||
|Korea Central|31|38|
|Korea South|20|12|
|North Central US|143|148|
|North Europe|232|239|
|Norway East|236|250|
|Norway West|233|247|
|Qatar Central|170|175|
|South Africa North|358|371|
|South Africa West|374|388|
|South Central US|125|132|
|South India|103|111|
|Southeast Asia|70|77|
|Sweden Central|240|255|
|Switzerland North|212|226|
|Switzerland West|209|222|
|UAE Central|147|153|
|UAE North|148|154|
|UK South|217|231|
|UK West|220|234|
|West Central US|120|126|
|West Europe|219|233|
|West India|122|126|
|West US|106|113|
|West US 2|99|105|
|West US 3|108|115|

#### [Western Europe](#tab/WesternEurope/Europe)

|Source|France Central|France South|West Europe|
|---|---|---|---|
|Australia Central|238|227|245|
|Australia Central 2|238|227|245|
|Australia East|233|222|240|
|Australia Southeast|230|219|237|
|Brazil South|184|193|184|
|Canada Central|99|109|100|
|Canada East|109|118|109|
|Central India|126|115|132|
|Central US|104|113|105|
|East Asia|180|169|187|
|East US|82|91|83|
|East US 2|86|95|87|
|France Central||13|11|
|France South|14||23|
|Germany North|18|25|13|
|Germany West Central|10|17|8|
|Japan East|212|201|219|
|Japan West|226|215|234|
|Korea Central|215|204|222|
|Korea South|209|198|216|
|North Central US|98|108|99|
|North Europe|17|26|18|
|Norway East|28|41|21|
|Norway West|24|33|17|
|Qatar Central|117|105|124|
|South Africa North|172|161|183|
|South Africa West|158|171|158|
|South Central US|112|122|114|
|South India|156|146|169|
|Southeast Asia|147|137|156|
|Sweden Central|36|43|22|
|Switzerland North|15|12|13|
|Switzerland West|12|8|17|
|UAE Central|111|100|118|
|UAE North|112|101|119|
|UK South|8|18|9|
|UK West|13|22|14|
|West Central US|118|129|119|
|West Europe|10|21||
|West India|123|112|130|
|West US|141|151|143|
|West US 2|140|149|142|
|West US 3|130|140|131|

#### [Central Europe](#tab/CentralEurope/Europe)

|Source|Germany North|Germany West Central|Switzerland North|Switzerland West|
|---|---|---|---|---|
|Australia Central|248|242|237|234|
|Australia Central 2|248|242|237|234|
|Australia East|243|237|232|228|
|Australia Southeast|240|234|229|226|
|Brazil South|195|189|196|192|
|Canada Central|110|105|111|107|
|Canada East|120|114|120|117|
|Central India|135|129|124|121|
|Central US|115|109|115|112|
|East Asia|191|185|179|176|
|East US|93|87|93|90|
|East US 2|97|91|98|94|
|France Central|17|10|15|11|
|France South|25|17|12|8|
|Germany North||10|15|19|
|Germany West Central|9||7|10|
|Japan East|223|217|211|208|
|Japan West|0|231|226|222|
|Korea Central|226|220|214|211|
|Korea South|220|214|208|204|
|North Central US|109|103|109|106|
|North Europe|28|23|30|25|
|Norway East|20|26|31|34|
|Norway West|23|24|29|32|
|Qatar Central|127|121|116|112|
|South Africa North|184|180|175|171|
|South Africa West|168|163|170|166|
|South Central US|124|117|124|120|
|South India|160|162|158|157|
|Southeast Asia|161|155|149|146|
|Sweden Central|18|27|33|36|
|Switzerland North|15|7||6|
|Switzerland West|18|10|6||
|UAE Central|120|116|110|106|
|UAE North|122|116|111|107|
|UK South|21|14|20|16|
|UK West|23|17|25|21|
|West Central US|130|124|129|126|
|West Europe|13|9|14|17|
|West India|133|127|122|118|
|West US|153|147|153|149|
|West US 2|151|145|151|148|
|West US 3|141|135|141|138|

#### [Norway / Sweden](#tab/NorwaySweden/Europe)

|Source|Norway East|Norway West|Sweden Central|
|---|---|---|---|
|Australia Central|262|258|265|
|Australia Central 2|262|258|266|
|Australia East|257|253|261|
|Australia Southeast|254|250|258|
|Brazil South|203|197|206|
|Canada Central|117|107|128|
|Canada East|126|117|138|
|Central India|149|144|153|
|Central US|122|127|133|
|East Asia|204|200|208|
|East US|99|95|109|
|East US 2|104|100|114|
|France Central|28|23|35|
|France South|41|33|43|
|Germany North|23|23|19|
|Germany West Central|26|23|27|
|Japan East|236|232|240|
|Japan West|251|247|255|
|Korea Central|239|235|243|
|Korea South|233|229|237|
|North Central US|115|115|127|
|North Europe|37|33|45|
|Norway East||9|9|
|Norway West|9||16|
|Qatar Central|140|137|144|
|South Africa North|200|196|204|
|South Africa West|177|171|180|
|South Central US|130|131|141|
|South India|181|177|185|
|Southeast Asia|174|170|178|
|Sweden Central|9|16||
|Switzerland North|31|29|33|
|Switzerland West|34|32|36|
|UAE Central|135|131|139|
|UAE North|136|132|140|
|UK South|27|23|37|
|UK West|29|25|40|
|West Central US|135|140|150|
|West Europe|22|16|27|
|West India|146|142|150|
|West US|160|164|170|
|West US 2|157|162|168|
|West US 3|147|150|159|

#### [UK / North Europe](#tab/UKNorthEurope/Europe)

|Source|UK South|UK West|North Europe|
|---|---|---|---|
|Australia Central|243|245|251|
|Australia Central 2|243|245|251|
|Australia East|238|240|246|
|Australia Southeast|235|237|243|
|Brazil South|178|180|170|
|Canada Central|93|96|84|
|Canada East|103|106|93|
|Central India|130|132|137|
|Central US|98|100|89|
|East Asia|185|187|193|
|East US|76|79|67|
|East US 2|80|84|71|
|France Central|8|12|17|
|France South|18|22|26|
|Germany North|22|25|29|
|Germany West Central|14|17|22|
|Japan East|217|219|231|
|Japan West|231|234|238|
|Korea Central|220|222|228|
|Korea South|214|216|222|
|North Central US|92|95|83|
|North Europe|11|14||
|Norway East|27|29|35|
|Norway West|23|25|32|
|Qatar Central|122|124|130|
|South Africa North|173|174|179|
|South Africa West|152|154|160|
|South Central US|106|110|97|
|South India|161|167|169|
|Southeast Asia|153|158|163|
|Sweden Central|37|40|45|
|Switzerland North|20|25|29|
|Switzerland West|17|21|25|
|UAE Central|116|118|124|
|UAE North|116|119|125|
|UK South||5|11|
|UK West|6||14|
|West Central US|112|115|103|
|West Europe|9|11|17|
|West India|127|130|135|
|West US|136|139|127|
|West US 2|134|137|125|
|West US 3|124|127|115|


#### [Korea](#tab/Korea/AsiaPacific)

|Source|Korea Central|Korea South|
|---|---|---|
|Australia Central|152|144|
|Australia Central 2|152|144|
|Australia East|128|139|
|Australia Southeast|140|148|
|Brazil South|301|297|
|Canada Central|178|174|
|Canada East|187|184|
|Central India|118|111|
|Central US|158|152|
|East Asia|38|31|
|East US|183|180|
|East US 2|184|175|
|France Central|214|208|
|France South|204|198|
|Germany North|226|220|
|Germany West Central|220|213|
|Japan East|30|19|
|Japan West|37|12|
|Korea Central||8|
|Korea South|8||
|North Central US|165|164|
|North Europe|228|222|
|Norway East|239|233|
|Norway West|235|229|
|Qatar Central|169|163|
|South Africa North|360|354|
|South Africa West|376|370|
|South Central US|152|142|
|South India|104|96|
|Southeast Asia|68|61|
|Sweden Central|243|237|
|Switzerland North|214|208|
|Switzerland West|211|204|
|UAE Central|146|140|
|UAE North|147|141|
|UK South|219|213|
|UK West|222|216|
|West Central US|143|137|
|West Europe|221|215|
|West India|120|114|
|West US|130|123|
|West US 2|122|116|
|West US 3|135|124|


#### [India](#tab/India/AsiaPacific)

|Source|Central India|West India|South India|
|---|---|---|---|
|Australia Central|145|145|126|
|Australia Central 2|144|145|126|
|Australia East|140|141|121|
|Australia Southeast|133|137|118|
|Brazil South|305|302|337|
|Canada Central|215|213|252|
|Canada East|224|222|260|
|Central India||5|23|
|Central US|235|232|230|
|East Asia|83|85|68|
|East US|202|200|235|
|East US 2|203|201|233|
|France Central|125|123|156|
|France South|115|113|146|
|Germany North|136|133|168|
|Germany West Central|129|127|161|
|Japan East|118|122|102|
|Japan West|126|127|111|
|Korea Central|119|120|104|
|Korea South|111|114|96|
|North Central US|223|220|247|
|North Europe|138|135|169|
|Norway East|148|146|181|
|Norway West|144|143|177|
|Qatar Central|38|36|64|
|South Africa North|270|267|302|
|South Africa West|287|284|317|
|South Central US|237|231|234|
|South India|23|30||
|Southeast Asia|50|54|35|
|Sweden Central|153|150|184|
|Switzerland North|124|122|157|
|Switzerland West|121|118|157|
|UAE Central|33|29|49|
|UAE North|33|28|49|
|UK South|130|127|161|
|UK West|132|130|167|
|West Central US|241|242|216|
|West Europe|132|129|169|
|West India|5||29|
|West US|218|221|202|
|West US 2|210|211|195|
|West US 3|232|233|217|

#### [Asia](#tab/Asia/AsiaPacific)

|Source|East Asia|Southeast Asia|
|---|---|---|
|Australia Central|125|94|
|Australia Central 2|125|94|
|Australia East|122|89|
|Australia Southeast|116|83|
|Brazil South|328|341|
|Canada Central|197|218|
|Canada East|206|227|
|Central India|83|50|
|Central US|177|197|
|East Asia||34|
|East US|199|222|
|East US 2|195|218|
|France Central|179|147|
|France South|169|137|
|Germany North|192|162|
|Germany West Central|185|155|
|Japan East|46|70|
|Japan West|47|77|
|Korea Central|38|69|
|Korea South|32|61|
|North Central US|186|205|
|North Europe|193|164|
|Norway East|204|174|
|Norway West|200|171|
|Qatar Central|133|98|
|South Africa North|327|296|
|South Africa West|342|312|
|South Central US|168|192|
|South India|68|35|
|Southeast Asia|34||
|Sweden Central|208|179|
|Switzerland North|179|150|
|Switzerland West|176|146|
|UAE Central|111|78|
|UAE North|112|80|
|UK South|185|153|
|UK West|188|158|
|West Central US|163|184|
|West Europe|187|156|
|West India|85|54|
|West US|149|169|
|West US 2|142|162|
|West US 3|151|175|

#### [UAE / Qatar](#tab/uae-qatar/MiddleEast)

|Source|Qatar Central|UAE Central|UAE North|
|---|---|---|---|
|Australia Central|191|170|170|
|Australia Central 2|191|170|171|
|Australia East|187|167|167|
|Australia Southeast|184|160|162|
|Brazil South|297|291|292|
|Canada Central|207|201|202|
|Canada East|215|210|211|
|Central India|38|33|33|
|Central US|227|221|222|
|East Asia|133|112|112|
|East US|194|188|189|
|East US 2|197|187|188|
|France Central|116|111|111|
|France South|106|100|101|
|Germany North|128|122|123|
|Germany West Central|120|115|116|
|Japan East|169|147|148|
|Japan West|175|153|156|
|Korea Central|170|146|148|
|Korea South|163|140|141|
|North Central US|215|209|210|
|North Europe|130|124|125|
|Norway East|140|135|136|
|Norway West|137|131|132|
|Qatar Central||62|62|
|South Africa North|268|256|257|
|South Africa West|276|272|273|
|South Central US|226|215|215|
|South India|64|49|50|
|Southeast Asia|98|78|80|
|Sweden Central|144|139|140|
|Switzerland North|116|110|111|
|Switzerland West|112|106|107|
|UAE Central|62||6|
|UAE North|62|6||
|UK South|122|115|116|
|UK West|124|118|119|
|West Central US|240|234|235|
|West Europe|123|117|118|
|West India|36|29|29|
|West US|264|258|258|
|West US 2|262|254|256|
|West US 3|250|237|239|

### [South Africa](#tab/southafrica/MiddleEast)

|Source|South Africa North|South Africa West|
|---|---|---|
|Australia Central|384|399|
|Australia Central 2|384|399|
|Australia East|378|394|
|Australia Southeast|376|391|
|Brazil South|345|326|
|Canada Central|256|237|
|Canada East|265|245|
|Central India|270|287|
|Central US|274|256|
|East Asia|327|342|
|East US|243|224|
|East US 2|248|229|
|France Central|172|157|
|France South|162|171|
|Germany North|187|169|
|Germany West Central|180|163|
|Japan East|358|373|
|Japan West|372|388|
|Korea Central|361|376|
|Korea South|354|370|
|North Central US|263|245|
|North Europe|180|160|
|Norway East|200|177|
|Norway West|194|171|
|Qatar Central|269|277|
|South Africa North||19|
|South Africa West|19||
|South Central US|276|259|
|South India|302|318|
|Southeast Asia|296|311|
|Sweden Central|202|180|
|Switzerland North|176|170|
|Switzerland West|172|166|
|UAE Central|256|272|
|UAE North|257|272|
|UK South|173|151|
|UK West|174|154|
|West Central US|288|270|
|West Europe|183|157|
|West India|268|284|
|West US|312|294|
|West US 2|310|291|
|West US 3|296|277|

---

Additionally, you can view all of the data in a single table.

:::image type="content" source="media/azure-network-latency/azure-network-latency.png" alt-text="Screenshot of full region latency table" lightbox="media/azure-network-latency/azure-network-latency-thumb.png":::

## Next steps

Learn about [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).
