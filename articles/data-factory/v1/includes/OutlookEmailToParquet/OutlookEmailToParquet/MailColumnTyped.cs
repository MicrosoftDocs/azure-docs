using System;
using System.Collections.Generic;




namespace OutlookEmailToParquet
{
    public class MailColumnTyped<T> : MailColumn
    {
        public readonly List<T> Values;
        public MailColumnTyped(string colname)
        {
            this.Name = colname;
            this.Datatype = typeof(T);
            this.Values = new List<T>();            
        }

        public void Add(T value)
        {
            this.Values.Add(value);
        }

        public override Array ToSystemArray()
        {
            return this.Values.ToArray();
        }

        public override int Count()
        {
            return this.Values.Count;
        }
    }
}
