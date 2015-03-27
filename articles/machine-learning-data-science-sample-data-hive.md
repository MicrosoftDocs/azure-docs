<properties 
	pageTitle="Sample data in Azure HDInsight Hive tables | Azure" 
	description="Down sampling data in Azure HDInsight Hive Tables" 
	metaKeywords="" 
	services="machine-learning" 
	solutions="" 
	documentationCenter="" 
	authors="hangzh-msft" 
	manager="jacob.spoelstra" 
	editor="cgronlun"  />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/16/2015" 
	ms.author="hangzh;bradsev" />

# Sample data in Azure HDInsight Hive tables 

If the dataset you plan to analyze is big, it is usually a good idea to down-sample the data to reduce it to a smaller but representative and more manageable size. This facilitates data understanding, exploration, and feature engineering. Its role in the Data Science Process, is to enable fast prototyping of the data processing functions and machine learning models.

In this article, we describe how to down-sample data in Azure HDInsight Hive tables using Hive queries. We cover three popularly used sampling methods: Uniform random sampling, random sampling by groups, and stratified sampling.

You should submit the Hive queries from the Hadoop Command Line console on the head node of the Hadoop cluster. To do this, log into the head node of the Hadoop cluster, open the Hadoop Command Line console, and submit the Hive queries from there. For instructions on submitting Hive queries in the Hadoop Command Line console, see [How to Submit Hive Queries](machine-learning-data-science-process-hive-tables.md#submit). 

## <a name="uniform"></a> Uniform random sampling ##
Uniform random sampling means that each row in the data set has an equal chance of being sampled. This can be implemented by adding an extra field rand() to the data set in the inner "select" query, and in the outer "select" query that condition on that random field. 

Here is an example query:

	SET sampleRate=<sample rate, 0-1>;
	select
		field1, field2, …, fieldN
	from
		(
		select
			field1, field2, …, fieldN, rand() as samplekey 
		from <hive table name>
		)a
	where samplekey<='${hiveconf:sampleRate}'

Here, `<sample rate, 0-1>` specifies the proportion of records that the users want to sample. 

## <a name="group"></a> Random sampling by groups ##

When sampling categorical data, you may want to either include or exclude all of the instances of some particular value of a categorical variable. This is what is meant by "sampling by group".
For example, if you have a categorical variable "State", which has values NY, MA, CA, NJ, PA, etc, you want records of the same state be always together, whether they are sampled or not. 

Here is an example query that samples by group:

	SET sampleRate=<sample rate, 0-1>;
    select 
		b.field1, b.field2, …, b.catfield, …, b.fieldN
	from
		(
		select 
			field1, field2, …, catfield, …, fieldN
		from <table name>
		)b
	join
		(
		select
			catfield
		from
			(
			select 
				catfield, rand() as samplekey
			from <table name>
			group by catfield
			)a
		where samplekey<='${hiveconf:sampleRate}'
		)c
	on b.catfield=c.catfield

## <a name="stratified"></a>Stratified sampling

Random sampling is stratified with respect to a categorical variable when the samples obtained have values of that categorical that are in the same ratio as in the parent population from which the samples were obtained. Using the same example as above, suppose your data has sub-populations by states, say NJ has 100 observations, NY has 60 observations, and WA has 300 observations. If you specify the rate of stratified sampling to be 0.5, then the sample obtained should have approximately 50, 30, and 150 observations of NJ, NY, and WA respectively.

Here is an example query:

	SET sampleRate=<sample rate, 0-1>;
    select 
		field1, field2, field3, ..., fieldN, state 
	from
		(
		select 
			field1, field2, field3, ..., fieldN, state,
			count(*) over (partition by state) as state_cnt, 
      		rank() over (partition by state order by rand()) as state_rank
      	from <table name>
		) a 
	where state_rank <= state_cnt*'${hiveconf:sampleRate}'


For information on more advanced sampling methods that are available in Hive, see [LanguageManual Sampling](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Sampling).
