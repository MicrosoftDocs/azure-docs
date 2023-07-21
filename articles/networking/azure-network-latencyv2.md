---
title: Azure network round-trip latency statistics
description: Learn about round-trip latency statistics between Azure regions.
services: networking
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 07/21/2023
ms.author: allensu
---

# Azure network round-trip latency statistics

Azure continuously monitors the latency (speed) of core areas of its network using internal monitoring tools and measurements.

## How are the measurements collected?

The latency measurements are collected from Azure cloud regions worldwide, and continuously measured in 1-minute intervals by network probes. The monthly latency statistics are derived from averaging the collected samples for the month.

## Round-trip latency figures

The monthly Percentile P50 round trip times between Azure regions for a 30-day window are shown as follows. 

#### [North America / South America](#tab/Americas)

Listing of Western Hemisphere regions including US, Canada, and Brazil.

#### [Middle East / Africa](#tab/MiddleEast)

#### [Europe](#tab/Europe)

Listing of European regions including UK, France, Germany, and Switzerland.

#### [Asia / Pacific](#tab/AsiaPacific)

Listing of Asia / Pacific regions including Japan, Korea, India, and Australia.
---

#### [US](#tab/US/Americas)
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


#### [Canada / Brazil](#tab/Canada/americas)

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

### [Fran]
#### [Australia](#tab/Australia/AsiaPacific)

| Source | Australia</br>Central | Australia</br>Central 2 | Australia</br>East | Australia</br>Southeast |
|--------|-------------------|---------------------|----------------|---------------------|
| Australia Central | NaN | 2 | 8 | 14 |
| Australia Central 2 | 2 | NaN | 8 | 14 |
| Australia East | 7 | 8 | NaN | 14 |
| Australia Southeast | 14 | 14 | 14 | NaN |
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


#### [India / Asia](#tab/India/AsiaPacific)

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

#### [UAE / Qatar](#tab/MiddleEast/uae-qatar)

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

### [South Africa](#tab/middleeast/southafrica)

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

> [!IMPORTANT]
> Monthly latency numbers across Azure regions do not change regulary. Given this, you can expect an update of this table every 6 to 9 months outside of the addition of new regions. When new regions come online, we will update this document as soon as data is available.

## Next steps

Learn about [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).
