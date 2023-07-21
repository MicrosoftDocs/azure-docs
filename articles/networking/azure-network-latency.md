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

#### [North America](#tab/NorthAmerica)

| Source | Brazil South | Canada Central | Canada East | Central US | East US | East US 2 | North Central US | South Central US | West Central US | West US | West US 2 | West US 3 |
|--------|--------------|----------------|-------------|------------|---------|-----------|------------------|------------------|-----------------|---------|-----------|-----------|
| Australia Central | 323 | 204 | 212 | 180 | 213 | 208 | 193 | 175 | 167 | 144 | 164 | 158 |
| Australia Central 2 | 323 | 204 | 212 | 181 | 213 | 209 | 193 | 176 | 167 | 144 | 164 | 158 |
| Australia East | 319 | 197 | 205 | 176 | 204 | 200 | 188 | 173 | 167 | 148 | 160 | 156 |
| Australia Southeast | 329 | 209 | 217 | 188 | 216 | 211 | 197 | 184 | 178 | 159 | 171 | 167 |
| Brazil South | NaN | 129 | 137 | 147 | 116 | 114 | 136 | 141 | 161 | 180 | 182 | 163 |
| Canada Central | 128 | NaN | 12 | 23 | 18 | 22 | 17 | 48 | 38 | 61 | 63 | 65 |
| Canada East | 137 | 13 | NaN | 31 | 27 | 31 | 26 | 58 | 46 | 69 | 73 | 73 |
| Central India | 305 | 216 | 224 | 235 | 203 | 203 | 223 | 237 | 241 | 218 | 210 | 232 |
| Central US | 147 | 24 | 31 | NaN | 24 | 27 | 9 | 26 | 16 | 39 | 38 | 43 |
| East Asia | 328 | 198 | 206 | 177 | 199 | 195 | 186 | 168 | 163 | 149 | 141 | 151 |
| East US | 115 | 18 | 26 | 24 | NaN | 6 | 19 | 32 | 43 | 64 | 64 | 51 |
| East US 2 | 114 | 22 | 31 | 28 | 7 | NaN | 22 | 28 | 45 | 60 | 64 | 47 |
| France Central | 183 | 98 | 108 | 104 | 82 | 85 | 97 | 112 | 120 | 142 | 142 | 130 |
| France South | 193 | 110 | 118 | 113 | 92 | 96 | 108 | 122 | 128 | 151 | 149 | 140 |
| Germany North | 195 | 112 | 121 | 116 | 94 | 98 | 111 | 125 | 131 | 155 | 152 | 143 |
| Germany West Central | 189 | 105 | 114 | 109 | 87 | 91 | 103 | 117 | 124 | 147 | 145 | 135 |
| Japan East | 275 | 154 | 162 | 134 | 156 | 151 | 142 | 125 | 120 | 106 | 98 | 108 |
| Japan West | 285 | 162 | 170 | 141 | 163 | 158 | 148 | 132 | 127 | 113 | 105 | 115 |
| Korea Central | 301 | 179 | 187 | 158 | 184 | 184 | 165 | 152 | 144 | 130 | 123 | 135 |
| Korea South | 296 | 175 | 183 | 153 | 181 | 175 | 164 | 142 | 138 | 123 | 116 | 125 |
| North Central US | 135 | 18 | 26 | 9 | 19 | 22 | NaN | 33 | 26 | 49 | 47 | 51 |
| North Europe | 170 | 83 | 92 | 94 | 67 | 71 | 85 | 98 | 108 | 132 | 130 | 119 |
| Norway East | 203 | 117 | 126 | 122 | 100 | 104 | 115 | 130 | 135 | 160 | 157 | 147 |
| Norway West | 197 | 107 | 117 | 127 | 96 | 99 | 115 | 131 | 141 | 164 | 162 | 150 |
| Qatar Central | 296 | 207 | 215 | 227 | 195 | 196 | 215 | 226 | 240 | 264 | 261 | 250 |
| South Africa North | 345 | 256 | 264 | 274 | 243 | 248 | 263 | 275 | 287 | 312 | 309 | 296 |
| South Africa West | 326 | 237 | 245 | 256 | 225 | 228 | 245 | 259 | 270 | 294 | 291 | 277 |
| South Central US | 141 | 48 | 57 | 26 | 33 | 28 | 33 | NaN | 24 | 34 | 45 | 20 |
| South India | 337 | 252 | 260 | 230 | 235 | 233 | 247 | 234 | 216 | 202 | 195 | 217 |
| Southeast Asia | 340 | 218 | 226 | 197 | 223 | 220 | 205 | 192 | 184 | 169 | 162 | 175 |
| Sweden Central | 206 | 129 | 137 | 132 | 110 | 115 | 126 | 141 | 150 | 170 | 168 | 159 |
| Switzerland North | 196 | 111 | 120 | 115 | 94 | 98 | 109 | 124 | 130 | 153 | 151 | 142 |
| Switzerland West | 192 | 108 | 117 | 112 | 91 | 94 | 106 | 121 | 126 | 149 | 148 | 138 |
| UAE Central | 291 | 201 | 210 | 221 | 189 | 187 | 209 | 215 | 234 | 258 | 254 | 238 |
| UAE North | 292 | 202 | 211 | 222 | 190 | 188 | 210 | 215 | 235 | 258 | 256 | 239 |
| UK South | 177 | 93 | 102 | 98 | 76 | 80 | 91 | 106 | 112 | 136 | 134 | 124 |
| UK West | 180 | 97 | 106 | 100 | 80 | 84 | 95 | 110 | 116 | 139 | 137 | 128 |
| West Central US | 161 | 42 | 46 | 16 | 42 | 43 | 25 | 24 | NaN | 25 | 24 | 31 |
| West Europe | 183 | 97 | 106 | 109 | 82 | 86 | 100 | 113 | 123 | 147 | 145 | 134 |
| West India | 302 | 213 | 221 | 232 | 201 | 201 | 220 | 231 | 242 | 221 | 210 | 233 |
| West US | 179 | 62 | 69 | 39 | 64 | 60 | 49 | 34 | 25 | NaN | 23 | 17 |
| West US 2 | 182 | 64 | 73 | 38 | 64 | 64 | 47 | 45 | 24 | 23 | NaN | 38 |
| West US 3 | 162 | 66 | 73 | 43 | 51 | 46 | 50 | 20 | 31 | 17 | 37 |  |


#### [Europe](#tab/Europe)

|Source|France Central|France South|Germany North|Germany West Central|North Europe|Norway East|Norway West|Sweden Central|Switzerland North|Switzerland West|UK South|UK West|West Europe|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|Australia Central|238|227|248|242|251|262|258|265|237|234|243|245|245|
|Australia Central 2|238|227|248|242|251|262|258|266|237|234|243|245|245|
|Australia East|233|222|243|237|246|257|253|261|232|228|238|240|240|
|Australia Southeast|230|219|240|234|243|254|250|258|229|226|235|237|237|
|Brazil South|184|193|195|189|170|203|197|206|196|192|178|180|184|
|Canada Central|99|109|110|105|84|117|107|128|111|107|93|96|100|
|Canada East|109|118|120|114|93|126|117|138|120|117|103|106|109|
|Central India|126|115|135|129|137|149|144|153|124|121|130|132|132|
|Central US|104|113|115|109|89|122|127|133|115|112|98|100|105|
|East Asia|180|169|191|185|193|204|200|208|179|176|185|187|187|
|East US|82|91|93|87|67|99|95|109|93|90|76|79|83|
|East US 2|86|95|97|91|71|104|100|114|98|94|80|84|87|
|France Central|NaN|13|17|10|17|28|23|35|15|11|8|12|11|
|France South|14|NaN|25|17|26|41|33|43|12|8|18|22|23|
|Germany North|18|25|NaN|10|29|23|23|19|15|19|22|25|13|
|Germany West Central|10|17|9|NaN|22|26|23|27|7|10|14|17|8|
|Japan East|212|201|223|217|231|236|232|240|211|208|217|219|219|
|Japan West|226|215|0|231|238|251|247|255|226|222|231|234|234|
|Korea Central|215|204|226|220|228|239|235|243|214|211|220|222|222|
|Korea South|209|198|220|214|222|233|229|237|208|204|214|216|216|
|North Central US|98|108|109|103|83|115|115|127|109|106|92|95|99|
|North Europe|17|26|28|23|NaN|37|33|45|30|25|11|14|18|
|Norway East|28|41|20|26|35|NaN|9|9|31|34|27|29|21|
|Norway West|24|33|23|24|32|9|NaN|16|29|32|23|25|17|
|Qatar Central|117|105|127|121|130|140|137|144|116|112|122|124|124|
|South Africa North|172|161|184|180|179|200|196|204|175|171|173|174|183|
|South Africa West|158|171|168|163|160|177|171|180|170|166|152|154|158|
|South Central US|112|122|124|117|97|130|131|141|124|120|106|110|114|
|South India|156|146|160|162|169|181|177|185|158|157|161|167|169|
|Southeast Asia|147|137|161|155|163|174|170|178|149|146|153|158|156|
|Sweden Central|36|43|18|27|45|9|16|NaN|33|36|37|40|22|
|Switzerland North|15|12|15|7|29|31|29|33|NaN|6|20|25|13|
|Switzerland West|12|8|18|10|25|34|32|36|6|NaN|17|21|17|
|UAE Central|111|100|120|116|124|135|131|139|110|106|116|118|118|
|UAE North|112|101|122|116|125|136|132|140|111|107|116|119|119|
|UK South|8|18|21|14|11|27|23|37|20|16|NaN|5|9|
|UK West|13|22|23|17|14|29|25|40|25|21|6|NaN|14|
|West Central US|118|129|130|124|103|135|140|150|129|126|112|115|119|
|West Europe|10|21|13|9|17|22|16|27|14|17|9|11|NaN|
|West India|123|112|133|127|135|146|142|150|122|118|127|130|130|
|West US|141|151|153|147|127|160|164|170|153|149|136|139|143|
|West US 2|140|149|151|145|125|157|162|168|151|148|134|137|142|
|West US 3|130|140|141|135|115|147|150|159|141|138|124|127|131|

#### [Middle East/Africa](#tab/MiddleEast)

| Source | Qatar Central | South Africa North | South Africa West | UAE Central | UAE North |
| --- | --- | --- | --- | --- | --- |
| Australia Central | 191 | 384 | 399 | 170 | 170 |
| Australia Central 2 | 191 | 384 | 399 | 170 | 171 |
| Australia East | 187 | 378 | 394 | 167 | 167 |
| Australia Southeast | 184 | 376 | 391 | 160 | 162 |
| Brazil South | 297 | 345 | 326 | 291 | 292 |
| Canada Central | 207 | 256 | 237 | 201 | 202 |
| Canada East | 215 | 265 | 245 | 210 | 211 |
| Central India | 38 | 270 | 287 | 33 | 33 |
| Central US | 227 | 274 | 256 | 221 | 222 |
| East Asia | 133 | 327 | 342 | 112 | 112 |
| East US | 194 | 243 | 224 | 188 | 189 |
| East US 2 | 197 | 248 | 229 | 187 | 188 |
| France Central | 116 | 172 | 157 | 111 | 111 |
| France South | 106 | 162 | 171 | 100 | 101 |
| Germany North | 128 | 187 | 169 | 122 | 123 |
| Germany West Central | 120 | 180 | 163 | 115 | 116 |
| Japan East | 169 | 358 | 373 | 147 | 148 |
| Japan West | 175 | 372 | 388 | 153 | 156 |
| Korea Central | 170 | 361 | 376 | 146 | 148 |
| Korea South | 163 | 354 | 370 | 140 | 141 |
| North Central US | 215 | 263 | 245 | 209 | 210 |
| North Europe | 130 | 180 | 160 | 124 | 125 |
| Norway East | 140 | 200 | 177 | 135 | 136 |
| Norway West | 137 | 194 | 171 | 131 | 132 |
| Qatar Central | NaN | 269 | 277 | 62 | 62 |
| South Africa North | 268 | NaN | 19 | 256 | 257 |
| South Africa West | 276 | 19 | NaN | 272 | 273 |
| South Central US | 226 | 276 | 259 | 215 | 215 |
| South India | 64 | 302 | 318 | 49 | 50 |
| Southeast Asia | 98 | 296 | 311 | 78 | 80 |
| Sweden Central | 144 | 202 | 180 | 139 | 140 |
| Switzerland North | 116 | 176 | 170 | 110 | 111 |
| Switzerland West | 112 | 172 | 166 | 106 | 107 |
| UAE Central | 62 | 256 | 272 | NaN | 6 |
| UAE North | 62 | 257 | 272 | 6 | NaN |
| UK South | 122 | 173 | 151 | 115 | 116 |
| UK West | 124 | 174 | 154 | 118 | 119 |
| West Central US | 240 | 288 | 270 | 234 | 235 |
| West Europe | 123 | 183 | 157 | 117 | 118 |
| West India | 36 | 268 | 284 | 29 | 29 |
| West US | 264 | 312 | 294 | 258 | 258 |
| West US 2 | 262 | 310 | 291 | 254 | 256 |
| West US 3 | 250 | 296 | 277 | 237 | 239 |


### [Asia Pacific](#tab/AsiaPacific)

|Source|Central India|East Asia|Japan East|Japan West|Korea Central|Korea South|South India|Southeast Asia|West India|
|---|---|---|---|---|---|---|---|---|---|
|Australia Central|145|125|127|134|152|144|126|94|145|
|Australia Central 2|144|125|127|135|152|144|126|94|145|
|Australia East|140|122|102|109|128|139|121|89|141|
|Australia Southeast|133|116|113|120|140|148|118|83|137|
|Brazil South|305|328|275|283|301|297|337|341|302|
|Canada Central|215|197|154|161|178|174|252|218|213|
|Canada East|224|206|163|170|187|184|260|227|222|
|Central India|NaN|83|118|125|118|111|23|50|5|
|Central US|235|177|134|141|158|152|230|197|232|
|East Asia|83|NaN|46|47|38|31|68|34|85|
|East US|202|199|156|162|183|180|235|222|200|
|East US 2|203|195|152|158|184|175|233|218|201|
|France Central|125|179|212|225|214|208|156|147|123|
|France South|115|169|202|215|204|198|146|137|113|
|Germany North|136|192|224|238|226|220|168|162|133|
|Germany West Central|129|185|217|231|220|213|161|155|127|
|Japan East|118|46|NaN|10|30|19|102|70|122|
|Japan West|126|47|10|NaN|37|12|111|77|127|
|Korea Central|119|38|31|38|NaN|8|104|69|120|
|Korea South|111|32|20|12|8|NaN|96|61|114|
|North Central US|223|186|143|148|165|164|247|205|220|
|North Europe|138|193|232|239|228|222|169|164|135|
|Norway East|148|204|236|250|239|233|181|174|146|
|Norway West|144|200|233|247|235|229|177|171|143|
|Qatar Central|38|133|170|175|169|163|64|98|36|
|South Africa North|270|327|358|371|360|354|302|296|267|
|South Africa West|287|342|374|388|376|370|317|312|284|
|South Central US|237|168|125|132|152|142|234|192|231|
|South India|23|68|103|111|104|96|NaN|35|30|
|Southeast Asia|50|34|70|77|68|61|35|NaN|54|
|Sweden Central|153|208|240|255|243|237|184|179|150|
|Switzerland North|124|179|212|226|214|208|157|150|122|
|Switzerland West|121|176|209|222|211|204|157|146|118|
|UAE Central|33|111|147|153|146|140|49|78|29|
|UAE North|33|112|148|154|147|141|49|80|28|
|UK South|130|185|217|231|219|213|161|153|127|
|UK West|132|188|220|234|222|216|167|158|130|
|West Central US|241|163|120|126|143|137|216|184|242|
|West Europe|132|187|219|233|221|215|169|156|129|
|West India|5|85|122|126|120|114|29|54|NaN|
|West US|218|149|106|113|130|123|202|169|221|
|West US 2|210|142|99|105|122|116|195|162|211|
|West US 3|232|151|108|115|135|124|217|175|233|



### [Australia](#tab/Australia)

| Source | Australia Central | Australia Central 2 | Australia East | Australia Southeast |
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

---

> [!IMPORTANT]
> Monthly latency numbers across Azure regions do not change regulary. Given this, you can expect an update of this table every 6 to 9 months outside of the addition of new regions. When new regions come online, we will update this document as soon as data is available.

## Next steps

Learn about [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).
