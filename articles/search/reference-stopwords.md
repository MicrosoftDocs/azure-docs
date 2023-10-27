---
title: Stopwords
titleSuffix: Azure AI Search
description: Reference documentation containing the stopwords list of the Microsoft language analyzers. 

manager: nitinme
author: HeidiSteen
ms.author: heidist

ms.service: cognitive-search
ms.topic: reference
ms.date: 05/16/2022
---

# Stopwords reference (Microsoft analyzers)

When text is indexed into Azure AI Search, it's processed by analyzers so it can be efficiently stored in a search index. During this [lexical analysis](tutorial-create-custom-analyzer.md#how-analyzers-work) process, [language analyzers](index-add-language-analyzers.md) will remove stopwords specific to that language. Stopwords are non-essential words such as "the" or "an" that can be removed without compromising the lexical integrity of your content. 

Stopword removal applies to all supported [Lucene and Microsoft analyzers](index-add-language-analyzers.md#supported-language-analyzers) used in Azure AI Search.

This article lists the stopwords used by the Microsoft analyzer for each language. 

For the stopword list for Lucene analyzers, see the [Apache Lucene source code on GitHub](https://github.com/apache/lucene/tree/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis).

> [!TIP]
> To view the output of any given analyzer, call the [Analyze Text REST API](/rest/api/searchservice/test-analyzer). This API is often helpful for debugging unexpected search results.

## Arabic (ar.microsoft)

`في` `فى` `من` `ان` `أن` `إن` `على` `الى` `إلى` `التي` `التى` `عن` `الذي` `الذى` `مع` `لا` `ما` `هذا` `هذه` `بعد` `لم` `كان` `إنه` `انه` `أنه ` `كل` `او` `أو` `و` `ذلك` `وفي` `وفى` `هو` `قبل` `كما` `منذ` `غير` `كانت` `وكان` `أي` `اي` `اى` `حتى` `وقد` `ولا` `فيها` `قد` `هي` `هى` `وهو` `الذين` `ومن` `حول` `لكن` `له` `دون` `أيضا` `ايضا` `حيث` `الا` `ألا` `إلا` `بعض` `امام` `أمام` `فيه` `اذا` `إذا` `بها` `وان` `وإن` `وأن` `انها` `أنها` `إنها` `ثم` `نحو` `عليه` `لها` `وهي` `وهى` `ولم` `بل` `منها` `وبه` `به` `وكانت` `ومنها` `وعليها` `عليها` `عندما` `هناك` `يمكن` `ليس ` `ولن` `ومثل` `لدى` `وعبر` `وحين` `واما` `وإما` `وأما` `وعند` `وآخر` `وأي` `وأى` `واى` `واذ` `وإذ` `وتلك` `وال` `ومما` `ومنه` `وبأن` `وتحت` `وبما` `والآن` `والان` `وام` `وإم` `وفقط` `لن` `مثل` `وعلى` `عبر` `حين` `علي  ` `اما` `أما` `إما` `عند` `آخر` `اخر` `ولكن` `اذ` `تلك` `أي ` `أى` `اي` `اى` `ال` `مما` `وهذا` `منه` `بأن` `تحت` `تكون` `وما` `ولكن ` `بما` `الآن` `فقط` `ام` `ا` `ب` `ت` `ث` `ج` `ح` `خ` `د` `ذ` `ر` `ز` `س` `ش` `ص` `ض` `ك` `ط` `ظ` `ع` `غ` `ف` `ق` `ك` `ل` `م` `ن` `ه` `و` `ي` `أ` `إ` `آ` `ى` `ئ` `ء` `ؤ` `ة` 

## Bengali (bn.microsoft)

`во` `бы` `не` `на` `что` `по` `для` `как` `от` `это` `из` `за` `только` `или` `их` `все` `его` `он` `но` `до` `же` `то` `так` `уже` `а` `б` `в` `г` `д` `е` `ё` `ж` `з` `и` `й` `к` `л` `м` `н` `о` `п` `р` `с` `т` `у` `ф` `х` `ц` `ч` `ш` `щ` `ъ` `ы` `ь` `э` `ю` `я` 

## Bulgarian (bg.microsoft)

`вж` `до` `е` `и` `на` `от` `то` `у ` `че` 

## Catalan (ca.microsoft)

`la` `el` `l` `les` `de` `d` `del` `dels` `i` `un` `una` `uns` `unes` `a` `als` `al` `en` `és` `es` `s` `se` `hi` 

## Chinese Simplified (zh-Hans.microsoft)

`?about` `$ 1 2 3 4 5 6 7 8 9 0 _` `a b c d e f g h i j k l m n o p q r s t u v w x y z` `after` `all` `also` `an` `and` `another` `any` `are` `as` `at` `be` `because` `been` `before` `being` `between` `both` `but` `by` `came` `can` `come` `could` `did` `do` `each` `for` `from` `get` `got` `had` `has` `have` `he` `her` `here` `him` `himself` `his` `how` `if` `in` `into` `is` `it` `like` `make` `many` `me` `might` `more` `most` `much` `must` `my` `never` `now` `of` `on` `only` `or` `other` `our` `out` `over` `said` `same` `see` `should` `since` `some` `still` `such` `take` `than` `that` `the` `their` `them` `then` `there` `these` `they` `this` `those` `through` `to` `too` `under` `up` `very` `was` `way` `we` `well` `were` `what` `where` `which` `while` `who` `with` `would` `you` `your` `的` `在` `了` `是` `有` `为` `这` `我` `也` `就` `他` `与` `等` `以` `着` `而` `从` `并` `还` `已` `但` `你` `之` `更` `又` `得` `她` `它` `很` `其` `该` `那` `各` 

## Chinese Traditional (zh-Hant.microsoft)

`?about` `$ 1 2 3 4 5 6 7 8 9 0 _` `a b c d e f g h i j k l m n o p q r s t u v w x y z` `after` `all` `also` `an` `and` `another` `any` `are` `as` `at` `be` `because` `been` `before` `being` `between` `both` `but` `by` `came` `can` `come` `could` `did` `do` `each` `for` `from` `get` `got` `had` `has` `have` `he` `her` `here` `him` `himself` `his` `how` `if` `in` `into` `is` `it` `like` `make` `many` `me` `might` `more` `most` `much` `must` `my` `never` `now` `of` `on` `only` `or` `other` `our` `out` `over` `said` `same` `see` `should` `since` `some` `still` `such` `take` `than` `that` `the` `their` `them` `then` `there` `these` `they` `this` `those` `through` `to` `too` `under` `up` `very` `was` `way` `we` `well` `were` `what` `where` `which` `while` `who` `with` `would` `you` `your` `的` `一` `不` `在` `人` `有` `是` `為` `以` `於` `上` `他` `而` `後` `之` `來` `及` `了` `因` `下` `可` `到` `由` `這` `與` `也` `此` `但` `並` `個` `其` `已` `無` `小` `我` `們` `起` `最` `再` `今` `去` `好` `只` `又` `或` `很` `亦` `某` `把` `那` `你` `乃` `它` 

## Croatian (hr.microsoft)

`i` `u` `je` `se` `na` `za` `da` `su` `o` `od` `a` `s` 

## Czech (cs.microsoft)

`na` `se` `je` `že` `do` `to` `ve` `ale` `za` `si` `pro` `po` `by` `od` `už` `který` `bude` `jako` `tak` `jsou` `jsem` `jsme` `však` `podle` `až` `jen` `ze` `před` `také` `jeho` `má` `když` `byl` `co` `jak` `nebo` `při` `ještě` `aby` `než` `budou` `ani` `jaké` `další` `kteří` `není` `bylo` `mezi` `v` `a` `i` `ač` `ačkoli` `přece` `no` `ne` `ano` `která` `které` `kterou` `kterými` `budu` `budeme` `budete` `byli` `byly` `o` `ať` `Á` `á` `Ě` `ě` `É` `é` `Í` `í` `Ó` `ó` `Ú` `ú` `Ů` `ů` `Ď` `ď` `Ň` `ň` `Č` `č` `Ř` `Š` `š` `ř` `Ť` `ť` `Ž` `ž` `Ý` `ý` `a` `b` `c` `d` `e` `f` `g` `h` `i` `j` `k` `l` `m` `n` `o` `p` `q` `r` `s` `t` `u` `v` `w` `x` `y` `z` `A` `B` `C` `D` `E` `F` `G` `H` `I` `J` `K` `L` `M` `N` `O` `P` `Q` `R` `S` `T` `U` `V` `W` `X` `Y` `Z` `0` `1` `2` `3` `4` `5` `6` `7` `8` `9` `I` `II` `III` `IV` `V` `VI` `VII` `VIII` `IX` `X` `XI` `XII` `XIII` `XIV` `XVI` `XVII` `XX` `X` `I` `V` `L` `D` `M` `C` `LD` `CCC` `IV` `VII` `XXXII` `LXXI` `VIII` `DCII` `LXX` `DCII.` `III` `DCCLII` `CDIX` `XXVII` `LIV` `MMVI` `MCMLXXII` `LXX` `DCC` `LII` `DCCIV` `DCV` `LXXIV` `LXV` `IXX` `XVIII` 

## Danish (da.microsoft)

`af` `alting` `at` `begge` `countries` `de` `dem` `den` `dén` `denne` `der` `deres` `det` `dét` `dette` `dig` `din` `dine` `disse` `dit` `du` `eder` `eders` `en` `én` `enhver` `ens` `er` `et` `ét` `ethvert` `for` `fra` `ham` `han` `hans` `har` `hende` `hendes` `hin` `hinanden` `hun` `hverandre` `hvis` `hvo` `I` `ikke` `ingen` `ingenting` `jeg` `jer` `jeres` `man` `med` `men` `mig` `min` `mine` `mit` `nogen` `nogle` `og` `om` `os` `på` `sig` `sin` `sine` `sit` `som` `somme` `til` `være` `vi` `vor` `Vor` `vore` `vores` 

## Dutch (nl.microsoft)

`de` `van` `en` `het` `in` `een` `is` `zijn` `de` `met` `op` `te` `voor` `die` `door` `dat` `aan` `tot` `als` `of` `in` `hij` `werd` `het` `uit` `bij` `ook` `niet` `wordt` `worden` `was` `er` `naar` `om` `zich` `maar` `heeft` `dan` `over` `deze` `nog` `meer` `kan` `ze` `hebben` `hun` `onder` `een` `kunnen` `tussen` `tegen` `dit` `na` `hij` `andere` `al` `zij` `veel` `men` `geen` `werden` `wel` `waar` `zie` `vooral` `weer` `deel` `je` `wat` `nu` `ten` `alle` `op` `van` `had` `waren` `maar` `moet` `zo` `zeer` `hem` `bij` `ook` 

## English (en.microsoft)

`is` `and` `in` `it` `of` `the` `to` `that` `this` `these` `those` `is` `was` `for` `on` `be` `with` `as` `by` `at` `have` `are` `this` `not` `but` `had` `from` `or` `I` `my` `me` `mine` `myself` `you` `your` `yours` `yourself` `he` `him` `his` `himself` `she` `her` `hers` `herself` `it` `its` `itself` `we` `our` `ours` `ourselves` `they` `them` `their` `theirs` `themselves` `A` `B` `C` `D` `E` `F` `G` `H` `J` `K` `L` `M` `N` `O` `P` `Q` `R` `S` `T` `U` `V` `W` `X` `Y` `Z` `a` `b` `c` `d` `e` `f` `g` `h` `i` `j` `k` `l` `m` `n` `o` `p` `q` `r` `s` `t` `u` `v` `w` `x` `y` `z` 

## Finnish (fi.microsoft)

`ai` `ainoa` `ainoaa` `ainoaan` `ainoaksi` `ainoalla` `ainoalle` `ainoalta` `ainoan` `ainoassa` `ainoasta` `ali` `alitse` `alla` `alle` `alta` `edellä` `edelle` `edeltä` `ehkä` `ei` `enemmän` `eniten` `ennen` `entä` `entäs` `erääkseen` `erääksi` `eräällä` `eräälle` `eräältä` `erään` `eräässä` `eräästä` `eräs` `eräskin` `erästä` `että` `hän` `häneen` `häneksi` `hänellä` `hänelle` `häneltä` `hänen` `hänessä` `hänestä` `harva` `harvaa` `harvaan` `harvaksi` `harvalla` `harvalle` `harvalta` `harvan` `harvassa` `harvasta` `harvat` `harvoihin` `harvoiksi` `harvoilla` `harvoille` `harvoilta` `harvoissa` `harvoista` `harvoja` `harvojen` `he` `heidän` `heihin` `heiksi` `heillä` `heille` `heiltä` `heissä` `heistä` `hiukan` `huolimatta` `ilman` `itse` `itseäni` `itseeni` `itseensä` `itsekseni` `itselläni` `itselleni` `itseni` `itsessäni` `itsestäni` `ja` `jälkeen` `johon` `johonkin` `joiden` `joidenkin` `joihin` `joihinkin` `joiksikin` `joilla` `joillakin` `joille` `joillekin` `joilta` `joiltakin` `joissa` `joissakin` `joista` `joistakin` `joita` `joka` `jokainen` `jokaiseksi` `jokaisella` `jokaiselle` `jokaiselta` `jokaisen` `jokaisessa` `jokaisesta` `jokaista` `jokin` `joko` `joksikin` `jokunen` `jolaiseen` `jolla` `jollainen` `jollaiseen` `jollaiseksi` `jollaisella` `jollaiselle` `jollaiselta` `jollaisen` `jollaisessa` `jollaisesta` `jollaiset` `jollaisia` `jollaisiin` `jollaisiksi` `jollaisilla` `jollaisille` `jollaisilta` `jollaisissa` `jollaisista` `jollaista` `jollaisten` `jollakin` `jolle` `jollekin` `jolta` `jonka` `jonkin` `jonkinlainen` `jonkinlaiseen` `jonkinlaiseksi` `jonkinlaisella` `jonkinlaiselle` `jonkinlaiselta` `jonkinlaisen` `jonkinlaisessa` `jonkinlaisesta` `jonkinlaiset` `jonkinlaisia` `jonkinlaisiin` `jonkinlaisiksi` `jonkinlaisilla` `jonkinlaisille` `jonkinlaisilta` `jonkinlaisissa` `jonkinlaisista` `jonkinlaista` `jonkinlaisten` `jos` `jossa` `jossakin` `josta` `jostakin` `jota` `jotakin` `jotka` `jotkin` `jotta` `kaikki` `kanssa` `kauas` `kaukana` `kautta` `keiden` `keitä` `kenen` `kera` `keskellä` `keskelle` `ketä` `ketkä` `kohti` `koska` `kuhunkin` `kuin` `kuinka` `kuitenkin` `kuka` `kukin` `kullakin` `kullekin` `kuluessa` `kuluttua` `kummallakin` `kummallekin` `kummaltakin` `kummankin` `kummassakin` `kummastakin` `kummatkin` `kumpaakin` `kumpaankin` `kumpanakin` `kumpiakin` `kumpienkin` `kumpikin` `kun` `kunkin` `kussakin` `kutakin` `kyllä` `kylläkin` `lähellä` `lähelle` `läpi` `lisäksi` `lukuunottamatta` `luokse` `luona` `luota` `me` `meidän` `meihin` `meiksi` `meillä` `meille` `meiltä` `meissä` `meistä` `meitä` `mikä` `miksei` `miksi` `milloin` `minä` `minua` `minuksi` `minulla` `minulle` `minulta` `minun` `minussa` `minusta` `minuun` `mistä` `miten` `mitkä` `molemmat` `molemmiksi` `molemmilla` `molemmille` `molemmissa` `molemmista` `molempia` `molempien` `molempiin` `moneen` `moneksi` `monella` `monelle` `monelta` `monen` `monenlainen` `monenlaiseen` `monenlaiseksi` `monenlaisella` `monenlaiselle` `monenlaiselta` `monenlaisen` `monenlaisessa` `monenlaisesta` `monenlaiset` `monenlaisia` `monenlaisiin` `monenlaisiksi` `monenlaisilla` `monenlaisille` `monenlaisilta` `monenlaisissa` `monenlaisista` `monenlaista` `monenlaisten` `monessa` `monesta` `moni` `monia` `monien` `moniin` `moniksi` `monilla` `monille` `monilta` `monissa` `monista` `monta` `montaa` `muihin` `muiksi` `muilla` `muille` `muilta` `muissa` `muista` `muita` `mukana` `mukanaan` `mutta` `muu` `muuan` `muuhun` `muuksi` `muulla` `muulle` `muulta` `muun` `muussa` `muusta` `muut` `muuta` `muutaista` `muutama` `muutamaa` `muutamaan` `muutamaksi` `muutamalla` `muutamalle` `muutamalta` `muutaman` `muutamassa` `muutamasta` `muutamat` `muutamia` `muutamien` `muutamiin` `muutamiksi` `muutamilla` `muutamille` `muutamilta` `muutamissa` `muutamista` `myös` `myöten` `näet` `näiden` `näihin` `näiksi` `näille` `nämä` `ne` `niiden` `niihin` `niiksi` `niille` `nimittäin` `no` `noiden` `noihin` `noiksi` `noille` `nuo` `ohhoh` `ohi` `ohitse` `paikkeilla` `päin` `paitsi` `paljon` `pitkin` `pois` `poispäin` `sama` `samaa` `samaan` `samaksi` `samalla` `samalle` `samalta` `saman` `samassa` `samasta` `samat` `samoihin` `samoiksi` `samoilla` `samoille` `samoilta` `samoissa` `samoista` `samoja` `samojen` `se` `sellainen` `sellaiseen` `sellaiseksi` `sellaisella` `sellaiselle` `sellaiselta` `sellaisen` `sellaisessa` `sellaisesta` `sellaiset` `sellaisia` `sellaisiin` `sellaisiksi` `sellaisilla` `sellaisille` `sellaisilta` `sellaisissa` `sellaisista` `sellaista` `sellaisten` `sen` `siihen` `siinä` `siis` `siitä` `siksi` `sillä` `sille` `siltä` `silti` `sinä` `sinua` `sinuksi` `sinulla` `sinulle` `sinulta` `sinun` `sinussa` `sinusta` `sinuun` `sitä` `taakse` `taas` `tähän` `tai` `takaa` `takana` `täksi` `tällainen` `tällaiseen` `tällaiseksi` `tällaisella` `tällaiselle` `tällaiselta` `tällaisen` `tällaisessa` `tällaisesta` `tällaiset` `tällaisia` `tällaisiin` `tällaisiksi` `tällaisilla` `tällaisille` `tällaisilta` `tällaisissa` `tällaisista` `tällaista` `tällaisten` `tälle` `tämä` `tämän` `te` `teidän` `toki` `tosin` `tuo` `tuohon` `tuoksi` `tuolle` `usea` `useaa` `useaan` `useaksi` `usealla` `usealle` `usealta` `usean` `useassa` `useasta` `useat` `useiden` `useiksi` `useilla` `useille` `useilta` `useisiin` `useissa` `useista` `useita` `vähän` `vähemmän` `vähiten` `vai` `vaikka` `vailla` `varten` `vasten` `vastoin` `vielä` `vieläkin` `voi` `yli` `yllä` `ylle` `yltä` `ympäri` `ympärillä` `ympärille` 

## French (fr.microsoft)

`ces` `cet` `cette` `de` `des` `du` `es` `et` `la` `le` `les` `on` `un` `une` 

## German (de.microsoft)

`aber` `alle` `aller` `alles` `als` `am` `an` `auch` `auf` `aus` `bei` `bis` `dann` `das` `daß` `dein` `dem` `den` `der` `deren` `des` `dessen` `die` `diese` `dieser` `dieses` `du` `durch` `ein` `eine` `einem` `einen` `einer` `eines` `einige` `einigem` `einigen` `einiger` `einiges` `er` `es` `etliche` `etlichem` `etlichen` `etlicher` `etliches` `euer` `eurer` `für` `gegen` `habe` `haben` `hat` `hatte` `ich` `ihr` `ihre` `im` `immer` `in` `ist` `jede` `jedem` `jeden` `jeder` `jedes` `jene` `jener` `jenes` `kann` `kein` `keine` `keinem` `keinen` `können` `man` `manche` `manchem` `manchen` `mancher` `manches` `mehr` `mein` `mit` `nach` `nicht` `noch` `nur` `oder` `schon` `sei` `sein` `seine` `seiner` `sich` `sie` `sind` `so` `soll` `über` `um` `und` `unser` `unter` `vom` `von` `vor` `war` `welche` `welcher` `welches` `wenn` `werden` `wessen` `wie` `wieder` `wir` `wird` `worden` `wurde` `zu` `zum` `zur` `zwei` `zwischen` `a` `ä` `b` `c` `d` `e` `f` `g` `h` `i` `j` `k` `l` `m` `n` `o` `ö` `p` `q` `r` `s` `t` `u` `ü` `v` `w` `x` `y` `z` `ß` `A` `Ä` `B` `C` `D` `E` `F` `G` `H` `I` `J` `K` `L` `M` `N` `O` `Ö` `P` `Q` `R` `S` `T` `U` `Ü` `V` `W` `X` `Y` `Z` `é` 

## Greek (el.microsoft)

`ο` `η` `το` `στο` `οι` `τα` `του` `εμάς` `εσάς` `εσένα` `εμένα` `σου` `αι` `ημών` `μένα` `σένα` `ων` `όντας` `εμέ` `σας` `μας` `σεις` `τοις` `τω` `υμάς` `υμείς` `υμών` `εσέ` `μείς` `μού` `σού` `τού` `τής` `τόν` `τήν` `μου` `τό` `μάς` `σάς` `τούς` `τά` `δικό` `δικός` `δικές` `δικών` `δική` `δικής` `δικήν` `δικιά` `δικιάν` `δικά` `δικιάς` `δικιές` `δικοί` `δικού` `δικούς` `δικόν` `της` `των` `τον` `την` `το` `τους` `τις` `τα` `τη` `ένας` `μια` `ένα` `ενός` `μιας` `με` `σε` `αν` `εάν` `να` `δια` `εκ` `εξ` `επί` `προ` `υπέρ` `από` `προς` `και` `ούτε` `μήτε` `ουδέ` `μηδέ` `ή` `είτε` `μα` `αλλά` `παρά` `όμως` `ωστόσο` `ενώ` `μολονότι` `μόνο` `πώς` `που` `πριν` `οτί` `λοιπόν` `ώστε` `άρα` `επομένως` `όταν` `σαν` `καθώς` `αφού` `αφότου` `πριν` `μόλις` `άμα` `προτού` `ως` `ώσπου` `όσο` `ωσότου` `όποτε` `κάθε` `γιατί` `επειδή` `ίσως` `παρά` `θα` `ας` `τι` `αντί` `μετά` `κατά` `από` `προς` `αλλά` `για` `τες` `κι` `σ'` `απ'` `γι'` `συ` `μ'` `κατ'` `ουτ'` `στ'` `παρ'` `τόσο` `τι` `όσο` `ό,τι` `θα` `όπου` `δε` `εάν` `εγώ` `εσύ` `αυτός` `αυτή` `αυτό` `εμείς` `εσείς` `αυτοί` `αυτές` `αυτά` `αυτών` `αυτούς` `αυτές` `πιο` `εδώ` `εκεί` `έτσι` `στα` `στων` `πλέον` `ακόμα` `τώρα` `τότε` `όταν` `ούτως` `άλλως` `αλλιώς` `συνεπώς` `εξής` `τούδε` `εφεξής` `όθεν` `οσοδήποτε` `εντούτοις` `μολαταύτα` `έστω` `παρόλο` `πια` `καθόλου` `καν` `χωρίς` `οποτεδήποτε` `πράγματι` `όντως` `άραγε` `μολοντούτο` `απολύτως` `παρομοίως` `σάμπως` `άκρως` `υπό` `ειδεμή` `δηλάδή` `ήτοι` `μέσω` `περί` `περίπου` `α` `A` `β` `B` `γ` `Γ` `δ` `Δ` `ε` `Ε` `ζ` `Ζ` `η` `H` `θ` `Θ` `ι` `Ι` `κ` `Κ` `λ` `Λ` `μ` `Μ` `ν` `Ν` `ξ` `Ξ` `ο` `Ο` `π` `Π` `ρ` `Ρ` `σ` `ς` `Σ` `τ` `Τ` `υ` `Υ` `φ` `Φ` `χ` `Χ` `ψ` `Ψ` `ω` `Ω` `ϊ` `ΐ` `Ϊ` `ϋ` `ΰ` `Ϋ` 

## Gujarati (gu.microsoft)

`માં` `તે` `એ` `આ` `છે` `અને` `નો` `ની` `નું` 

## Hebrew (he.microsoft)

`של` `אל` `את` 

## Hindi (hi.microsoft)

`है` `हैं` `में` `और` `का` `की` `के` `वह` `यह` 

## Hungarian (hu.microsoft)

`a` `az` `és` `hogy` `nem` `is` `de` `szerint` `már` `csak` `meg` `még` `ez` `volt` `mint` `azt` `vagy` `pedig` `aztán` `ha` `akkor` `izé` `szintén` `ki` `után` `kell` `majd` `van` `aki` `azonban` `lesz` `mert` `illetve` `amely` `akkor` `lehet` `nagyon` `miatt` `ami` `sem` `a` `á` `b` `c` `cs` `d` `dz` `dzs` `e` `é` `f` `g` `gy` `h` `i` `í` `j` `k` `l` `ly` `m` `n` `ny` `o` `ó` `ö` `ő` `p` `q` `r` `s` `sz` `t` `ty` `u` `ú` `ü` `ű` `v` `w` `x` `y` `z` `zs` `A` `Á` `B` `C` `Cs` `D` `Dz` `Dzs` `E` `É` `F` `G` `Gy` `H` `I` `Í` `J` `K` `L` `Ly` `M` `N` `Ny` `O` `Ó` `Ö` `Ő` `P` `Q` `R` `S` `Sz` `T` `Ty` `U` `Ú` `Ü` `Ű` `V` `W` `X` `Y` `Z` `Zs` 

## Icelandic (is.microsoft)

`að` `í` `á` `það` `eru` `er` `og` 

## Indonesian (Bahasa) (id.microsoft)

`ah` `di` `dong` `ialah` `ini` `itu` `juga` `ke` `sih` 

## Italian (it.microsoft)

`a` `agli` `ai` `al` `all'` `alla` `alle` `allo` `d'` `degli` `dei` `del` `dell'` `della` `delle` `dello` `di` `e` `è` `gli` `i` `il` `in` `l'` `la` `le` `lo` `negli` `nei` `nel` `nell'` `nella` `nelle` `nello` `un'` `un` `una` `uno` 

## Japanese (ja.microsoft)

`a` `and` `in` `is` `it` `of` `the` `to` `の` `を` `に` `は` `が` `と` `で` 

## Kannada (kn.microsoft)

`ಅ` `ಈ` `ಮತ್ತು` `ಮತ್ತೆ` `ಇರುತ್ತಾನೆ` `ಇರುತ್ತಾಳೆ` `ಇರುತ್ತದೆ` `ಇದು` `ಇದನ್ನು` `ಇದರ` `ಅದು` `ಅದನ್ನು` `ಅದರ` 

## Latvian (lv.microsoft)

`no` `un` `uz` `ir` 

## Lithuanian (lt.microsoft)

`ir` `arba` `yra` `jis` `ji` 

## Malayalam (ml.microsoft)

`ഒരു` `ആണ്` `ആണ്‍` `ഇത്` `അത്` `ഈ` `ആ` 

## Malay (Latin) (ms.microsoft)

`adalah` `atau` `dalam` `dan` `di` `ia` `ialah` `ini` `itu` `juga` `lah` 

## Marathi (mr.microsoft)

`होते` `त्या` `होता` `होती` `होतो` `होतं` `हा` `हे` `ही` `ह्या` `हें` `हीं` `ती` `ते` `ती` `त्या` `तें` `तीं` `त्यां` 

## Norwegian (nb.microsoft)

`av` `og` `en` `ei` `et` `til` `i` `er` `den` `det` 

## Polish (pl.microsoft)

`a` `do` `i` `jest` `na` `o` `ta` `te` `to` `w` `we` `z` `za` `się` `że` `od` `przez` `po` `dla` `jak` `tym` `ale` `ma` `co` `czy` `oraz` `może` `tego` `tylko` `jednak` `jego` `już` `lub` `ich` `ze` `tak` `być` `być` `jestem` `jesteś` `jest` `jesteśmy` `jesteście` `są` `będę` `będziesz` `będzie` `będziemy` `będziecie` `będą` `byłem` `byłam` `byłeś` `byłaś` `był` `była` `było` `byliśmy` `byłyśmy` `byliście` `byłyście` `byli` `były` `byłbym` `byłabym` `byłbyś` `byłabyś` `byłby` `byłaby` `byłoby` `bylibyśmy` `byłybyśmy` `bylibyście` `byłybyście` `byliby` `byłyby` `bądź` `bądźmy` `bądźcie` `będąc` `byłże` `byłaże` `byłoże` `byliże` `byłyże` `które` `która` `też` `także` `który` `tej` `przed` `można` `jej` `przy` `ten` `pod` `jeszcze` `gdy` `jako` `by` `bardzo` `bo` `jeśli` `tych` `więc` `bez` `również` `nawet` `temu` `tm` `tymi` `ja` `mnie` `mię` `mi` `mną` `ty` `ciebie` `cię` `tobie` `ci` `tobą` `on` `go` `mu` `jemu` `niego` `nim` `niemu` `my` `nas` `nam` `nami` `wy` `was` `wam` `wami` `oni` `im` `nich` `nimi` `mój` `mojego` `mego` `mojemu` `memu` `moim` `mym` `moja` `mojej` `mej` `moją` `mą` `moi` `moje` `moich` `mych` `me` `moimi` `mymi` `twój` `twojego` `twego` `twojemu` `twemu` `twoim` `twym` `twoja` `twa` `twojej` `twej` `twoją` `twą` `twoi` `twoje` `twe` `twoich` `twych` `twoimi` `twymi` `nasz` `naszego` `naszemu` `naszym` `nasza` `naszej` `naszą` `nasi` `nasze` `naszych` `naszymi` `wasz` `waszego` `waszemu` `waszym` `wasza` `waszej` `waszą` `wasi` `wasze` `waszych` `waszymi` `one` `ą` `b` `c` `ć` `d` `e` `ę` `f` `g` `h` `j` `k` `l` `ł` `m` `n` `ń` `ó` `p` `q` `r` `s` `ś` `t` `u` `v` `x` `y` `ź` `ż` `A` `Ą` `B` `C` `Ć` `D` `E` `Ę` `F` `G` `H` `I` `J` `K` `L` `Ł` `M` `N` `Ń` `O` `Ó` `P` `Q` `R` `S` `Ś` `T` `U` `V` `W` `X` `Y` `Z` `Ź` `Ż` 

## Portuguese (Brazil) (pt-Br.microsoft)

`à` `às` `é` `a` `ao` `aos` `as` `da` `das` `de` `do` `dos` `e` `em` `na` `nas` `no` `nos` `o` `os` `para` `um` `uma` `umas` `uns` 

## Portuguese (Portugal) (pt-Pt.microsoft)

`à` `às` `é` `a` `ao` `aos` `as` `da` `das` `de` `do` `dos` `e` `em` `na` `nas` `no` `nos` `o` `os` `para` `um` `uma` `umas` `uns` 

## Punjabi (pa.microsoft)

`ਹੈ` `ਹਨ` `ਦਾ` `ਦੇ` `ਦੀ` `ਦੀਆਂ` `ਵਿਚ` `ਅਤੇ` `ਇਹ` `ਉਹ` 

## Romanian (ro.microsoft)

`a` `ai` `al` `ale` `alor` `de` `din` `este` `în` `într` `la` `o` `pe` `şi` `un` `unei` `unor` `unui` 

## Russian (ru.microsoft)

`во` `бы` `не` `на` `что` `по` `для` `как` `от` `это` `из` `за` `только` `или` `их` `все` `его` `он` `но` `до` `же` `то` `так` `уже` `а` `б` `в` `г` `д` `е` `ё` `ж` `з` `и` `й` `к` `л` `м` `н` `о` `п` `р` `с` `т` `у` `ф` `х` `ц` `ч` `ш` `щ` `ъ` `ы` `ь` `э` `ю` `я` 

## Serbian (Cyrillic) (sr-cyrillic.microsoft)

`и` `је` `у` `да` `се` `на` `су` `за` `од` `са` `а` `из` `о` 

## Serbian (Latin) (sr-latin.microsoft)

`i` `je` `u` `se` `su` `a` 

## Slovak (sk.microsoft)

`z` `od` `na` `k` `o` `na` `a` `k` `v` `vo` `na` `je` `ono` 

## Slovenian (sl.microsoft)

`in` `k` `h` `v` `je` `ono` `onega` `onemu` `onem` `onim` 

## Spanish (es.microsoft)

`a` `al` `de` `del` `e` `el` `en` `es` `la` `las` `lo` `los` `un` `una` `unas` `unos` `y` 

## Swedish (sv.microsoft)

`av` `och` `en` `ett` `till` `i` `är` `den` `det` 

## Tamil (ta.microsoft)

`அது` `இது` `ஒரு` `அல்லது` `இந்த` `அந்த` 

## Telugu (te.microsoft)

`అతను` `ఆయన` `వారు` `వాండ్ళు` `వాళ్ళు` `ఆమె` `ఆనిడ` `అది` `అవి` `ఇతను` `ఈయవ` `వీరు` `వీండ్ళు` `ఈమె` `ఈనిడ` 

## Thai (th.microsoft)

`นะ` `ครับ` `ค่ะ` `ละ` `ฮะ` `ฮิ` `จ๊ะ` `วะ` `มั๊ย` `สิ` `เออ` `ฮึ` `ซิ` `นะจ๊ะ` `นะค่ะ` `เถอะ` `เถอะนะ` `เถอะน่า` `หรอก` `อุ๊ย` `อ่า` `ซะ` `หนิ` `หนะ` `หน่า` `นิ` `แหละ` `จ๊อกๆ` `ติ๋งๆ` `เหรอะ` `บรึม` `อึ๋ย` `แหนะ` `เฮ้ย` `โว้ย` `โอย` `เจี๊ยก` `หร๊อก` `บ๊ะ` `แน่ะ` `โอ` `แฮ้` `เหม่` `เอ๊ะ` `แฮ` `แฮะ` 

## Turkish (tr.microsoft)

`ama` `ancak` `bazı` `bir` `çok` `da` `daha` `de` `değil` `diye` `en` `gibi` `göre` `hem` `her` `için` `ile` `ise` `kadar` `ki` `sadece` `üzere` `ve` `veya` `ya` `a` `b` `c` `ç` `d` `e` `f` `g` `ğ` `h` `ı` `i` `j` `k` `l` `m` `n` `o` `ö` `p` `r` `s` `ş` `t` `u` `ü` `v` `y` `z` `A` `B` `C` `Ç` `D` `E` `F` `G` `Ğ` `H` `I` `İ` `J` `K` `L` `M` `N` `O` `Ö` `P` `R` `S` `Ş` `T` `U` `Ü` `V` `Y` `Z` `ben` `sen` `o` `biz` `siz` `onlar` `bu` `şu` `hangi ` `kendi` `bazı` `çok` `kim` `beni ` `bana` `bende ` `benden` `benim` `benimle` `bensiz` `seni ` `sana` `sende` `senden` `seninle` `sensiz` `onu ` `ona` `onda` `ondan` `onunla` `onsuz` `bizi ` `bize` `bizde` `bizden` `bizimle` `bizsiz` `sizi` `size` `sizde` `sizden` `sizinle` `sizsiz` `onları` `onlara` `onlarda` `onlardan` `onların` `onlarla` `onlarsız` `bazısı` `bazısını` `bazısına` `bazısında` `bazısından` `bazısının` `bazısıyla` `bazılarımız` `bazılarınız` `bazılarına` `bazılarını` `bazılarından` `bazılarıyla` `bazılarımızı` `bazılarınızı` `bazılarımıza` `bazılarınıza` `bazılarımızda` `bazılarınızda` `bazılarımızdan` `bazılarınızdan` `bazılarımızla` `bazılarınızla` `kimileri` `kimilerini` `kimilerine` `kimilerinde` `kimilerinden` `kimileriyle` `kimilerimiz` `kimilerimizi` `kimilerimize` `kimilerimizde` `kimilerimizden` `kimilerimizin` `kimilerimizle` `kimilerimizsiz` `kimileriniz` `kimilerinizi` `kimilerinize` `kimilerinizde` `kimilerinizden` `kimilerinizin` `kimilerinizle` `kimilerinizsiz` `kendim` `kendimi` `kendime` `kendimde` `kendimden` `kendimin` `kendimle` `kendimsiz` `kendin` `kendini` `kendine` `kendinde` `kendinden` `kendinin` `kendinle` `kendinsiz` `kendisi` `kendisini` `kendisine` `kendisinde` `kendisinden` `kendisiyle` `kendileri` `kendilerini` `kendilerine` `kendilerinde` `kendilerinden` `kendileriyle` `kaçımız` `kaçımızı` `kaçımıza` `kaçımızda` `kaçımızdan` `kaçımızla` `hangimiz` `hangimizi` `hangimize` `hangimizde` `hangimizden` `hangimizle` `hangimizsiz` `bunu` `buna` `bunda` `bundan` `bunun` `bununla` `bunsuz` `bunlar` `bunları` `bunlara` `bunlarda` `bunlardan` `bunların` `bunlarla` `bunlarsız` `şunu ` `şuna ` `şunda` `şundan` `şunun` `şununla` `şunsuz` `şunlar` `şunları` `şunlara ` `şunlarda` `şunlardan` `şunların` `şunlarla` `şunlarsız` 

## Ukrainian (uk.microsoft)

`і` `й` `до` `в` `у` `є` `з` `із` 

## Urdu (ur.microsoft)

`ہے` `ہیں` `میں` `اور` `کا` `کی` `کے` `یہ` `وہ` `اس` `ان` 

## See also

+ [Tutorial: Create a custom analyzer for phone numbers](tutorial-create-custom-analyzer.md)
+ [Add language analyzers to string fields](index-add-language-analyzers.md)
+ [Add custom analyzers to string fields](index-add-custom-analyzers.md)
+ [Full text search in Azure AI Search](search-lucene-query-architecture.md)
+ [Analyzers for text processing in Azure AI Search](search-analyzers.md)
