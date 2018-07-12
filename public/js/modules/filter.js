module.exports = {
    filterProducts: function(categories){
        var sqlStatement = "select p_id, p_name, c_name, inf_effect, steel_effect, cup_effect, lead_effect, zinc_effect, wms_effect from products p, categories c where p.c_id=c.c_id"
        if(categories.length == 1){
            sqlStatement += " and p.c_id=" + categories[0]
        }
        else if(categories.length > 1){
            sqlStatement += " and (p.c_id=" + categories[0]
            for(var i = 1; i < categories.length; i++){
                sqlStatement += " or p.c_id=" + categories[i]
            }
            sqlStatement += ")"
        }
        sqlStatement += ";"

        console.log(sqlStatement)
        sql.query(sqlStatement, function(data){
            ui.setResults(data, ['Product', 'Category', 'Inflation', 'Steel', 'Cuprum', 'Lead', 'Zinc', 'Workmanship'], 'delete-products')
        })
    },

    filterCategories: function(){
        sql.query('select * from categories;', function(data){
            ui.setResults(data, ['Category'], 'delete-categories')
        })
    },

    filterProjects: function(){
        sql.query('select * from projects;', function(data){
            ui.setResults(data, ['Project'], 'delete-projects')
        })
    },

    filterSuppliers: function(){
        sql.query('select * from suppliers;', function(data){
            ui.setResults(data, ['Supplier'], 'delete-suppliers')
        })
    },

    filterOffers: function(filter){
        var sqlStatement = "select o.o_id, pd.p_name as product, c.c_name, pj.pj_name as project, s.s_name, o.price, o.exchange, substr(o.date, 1, 12) as date, o.usd, o.eur, (1.0 + ((select case when sum(inf) is null then 0 else sum(inf) end from inflation where left(date, 7)>=left(o.date, 7))/100)) as inf from products pd, categories c, projects pj, suppliers s, offers o where (pd.c_id=c.c_id and o.pd_id=pd.p_id and o.pj_id=pj.pj_id and o.s_id=s.s_id)"

        if(filter.products.length == 1){
            sqlStatement += " and pd.p_id=" + filter.products[0]
        }
        else if(filter.products.length > 1){
            sqlStatement += " and (pd.p_id=" + filter.products[0]
            for(var i = 1; i < filter.products.length; i++){
                sqlStatement += " or pd.p_id=" + filter.products[i]
            }
            sqlStatement += ")"
        }
        
        if(filter.categories.length == 1){
            sqlStatement += " and c.c_id=" + filter.categories[0]
        }
        else if(filter.categories.length > 1){
            sqlStatement += " and (c.c_id=" + filter.categories[0]
            for(var i = 1; i < filter.categories.length; i++){
                sqlStatement += " or c.c_id=" + filter.categories[i]
            }
            sqlStatement += ")"
        }
        
        if(filter.projects.length == 1){
            sqlStatement += " and pj.p_id=" + filter.projects[0]
        }
        else if(filter.projects.length > 1){
            sqlStatement += " and (pj.p_id=" + filter.projects[0]
            for(var i = 1; i < filter.projects.length; i++){
                sqlStatement += " or pj.p_id=" + filter.projects[i]
            }
            sqlStatement += ")"
        }
        
        if(filter.suppliers.length == 1){
            sqlStatement += " and s.s_id=" + filter.suppliers[0]
        }
        else if(filter.suppliers.length > 1){
            sqlStatement += " and (s.s_id=" + filter.suppliers[0]
            for(var i = 1; i < filter.suppliers.length; i++){
                sqlStatement += " or s.s_id=" + filter.suppliers[i]
            }
            sqlStatement += ")"
        }
        
        if(filter.exchange != 'all'){
            sqlStatement += " and o.exchange='" + filter.exchange + "'"
        }
        
        if(filter.minPrice){
            if($.isNumeric(filter.minPrice)){
                sqlStatement += ' and o.price>=' + parseFloat(filter.minPrice)
            }
            else {
                ui.alert('filter-offer-failed', 'Price must be numeric!', false)
            }
        }

        if(filter.maxPrice){
            if($.isNumeric(filter.maxPrice)){
                sqlStatement += ' and o.price<=' + parseFloat(filter.maxPrice)
            }
            else {
                ui.alert('filter-offer-failed', 'Price must be numeric!', false)
            }
        }

        sqlStatement += " and o.date>='" + filter.date1 + "' and o.date<='" + filter.date2 + "'"

        if(filter.sort != 'sort'){
            sqlStatement += " ORDER BY " + filter.sort + " " + filter.ascDesc
        }
        sqlStatement += ";"
        
        console.log(sqlStatement)
        sql.query(sqlStatement, function(data){
            ui.setResults(data, ['Product', 'Category', 'Project', 'Supplier', 'Price', 'Exchange', 'Date'], 'delete-offers')
        })
    },

    filterMinPrices: function(){
        var sqlStatement = "select o.o_id, pd.p_name as product, c.c_name, pj.p_name as project, s.s_name, min(o.price), o.exchange, substr(o.date, 0, 12) as date, o.usd, o.eur, (1.0 + ((select case when sum(inf) is null then 0 else sum(inf) end from inflation where left(date, 7)>=left(o.date, 7))/100)) as inf from products pd, categories c, projects pj, suppliers s, offers o where (pd.c_id=c.c_id and o.pd_id=pd.p_id and o.pj_id=pj.p_id and o.s_id=s.s_id) group by pd.p_name"
        sql.query(sqlStatement, function(data){
            ui.setResults(data, ['Product', 'Category', 'Project', 'Supplier', 'Price', 'Exchange', 'Date'], 'delete-offers')
        })
    },

    filterMaxPrices: function(){
        var sqlStatement = "select o.o_id, pd.p_name as product, c.c_name, pj.p_name as project, s.s_name, max(o.price), o.exchange, substr(o.date, 0, 12) as date, o.usd, o.eur, (1.0 + ((select case when sum(inf) is null then 0 else sum(inf) end from inflation where left(date, 7)>=left(o.date, 7))/100)) as inf from products pd, categories c, projects pj, suppliers s, offers o where (pd.c_id=c.c_id and o.pd_id=pd.p_id and o.pj_id=pj.p_id and o.s_id=s.s_id) group by pd.p_name"
        sql.query(sqlStatement, function(data){
            ui.setResults(data, ['Product', 'Category', 'Project', 'Supplier', 'Price', 'Exchange', 'Date'], 'delete-offers')
        })
    },

    calcOtherVals: function(price, cb){
        if(!price.children().length){
            var data = {}
            var effect = {}
            var prices = {}
            var offerInfo = ui.readOfferInfo(price.parent())
            offerInfo.price = parseFloat(offerInfo.price)
            console.log('Offer Info: ', offerInfo)

            sql.query("select price from steel where date>='" + od.dayAgo(od.getDateNow(), 3) + "' and date<='" + od.getDateNow() + "' order by date desc;", function(check){
                prices.steelPriceNew = check[0].price
                sql.query("select price from steel where date>='" + od.dayAgo(offerInfo.date, 3) + "' and date<='" + offerInfo.date + "' order by date desc;", function(check){
                    prices.steelPriceOld = (check[0]) ? check[0].price : prices.steelPriceNew
                    sql.query("select price from coppor where date>='" + od.dayAgo(od.getDateNow(), 3) + "' and date<='" + od.getDateNow() + "' order by date desc;", function(check){
                        prices.cuprumPriceNew = check[0].price
                        sql.query("select price from coppor where date>='" + od.dayAgo(offerInfo.date, 3) + "' and date<='" + offerInfo.date + "' order by date desc;", function(check){
                            prices.cuprumPriceOld = check[0].price
                            sql.query("select price from leadp where date>='" + od.dayAgo(od.getDateNow(), 3) + "' and date<='" + od.getDateNow() + "' order by date desc;", function(check){
                                prices.leadPriceNew = check[0].price
                                sql.query("select price from leadp where date>='" + od.dayAgo(offerInfo.date, 3) + "' and date<='" + offerInfo.date + "' order by date desc;", function(check){
                                    prices.leadPriceOld = check[0].price
                                    sql.query("select price from zinc where date>='" + od.dayAgo(od.getDateNow(), 3) + "' and date<='" + od.getDateNow() + "' order by date desc;", function(check){
                                        prices.zincPriceNew = check[0].price
                                        sql.query("select price from zinc where date>='" + od.dayAgo(offerInfo.date, 3) + "' and date<='" + offerInfo.date + "' order by date desc;", function(check){
                                            prices.zincPriceOld = check[0].price
                                            sql.query("select * from products where p_name='" + offerInfo.product + "';", function(check){
                                                var productInfo = check[0]
                                                console.log('Product Info: ', productInfo)
                                                sql.query("select mw_amount from minwage where left(mw_date, 4)>='" + offerInfo.date.substr(0, 4) + "' and left(mw_date, 4)<='" + od.getDateNow().substr(0, 4) + "' order by mw_date desc;", function(check){
                                                    prices.mwNew = check[0].mw_amount
                                                    prices.mwOld = check[check.length - 1].mw_amount
                                                    console.log('Prices: ', prices)
    
                                                    effect.inf = productInfo.inf_effect * (offerInfo.inf - 1)
                                                    effect.steel = productInfo.steel_effect *((prices.steelPriceNew/prices.steelPriceOld) - 1)
                                                    effect.cup = productInfo.cup_effect * ((prices.cuprumPriceNew/prices.cuprumPriceOld) - 1)
                                                    effect.lead = productInfo.lead_effect * ((prices.leadPriceNew/prices.leadPriceOld) - 1)
                                                    effect.zinc = productInfo.zinc_effect * ((prices.zincPriceNew/prices.zincPriceOld) - 1)
                                                    effect.wms = productInfo.wms_effect *((prices.mwNew/prices.mwOld) - 1)
                                                    console.log('Effects: ', effect)

                                                    var ce =  1 + effect.inf + effect.steel + effect.cup + effect.lead + effect.zinc + effect.wms
                                                    console.log('CE: ', ce)
                
                                                    data.cell11 = 1
                                                    data.cell12 = parseFloat(offerInfo.usd)
                                                    data.cell13 = parseFloat(offerInfo.eur)
                
                                                    data.cell31 = parseFloat(offerInfo.inf)
    
    
                                                    od.setExchangeRateNow(function(exchange){
                                                        data.cell32 = exchange[0].selling
                                                        data.cell33 = exchange[1].selling
                
                                                        if(offerInfo.type == 'TL'){
                                                            data.cell21 = parseFloat(offerInfo.price.toFixed(2))
                                                            data.cell22 = parseFloat((offerInfo.price / parseFloat(offerInfo.usd)).toFixed(2))
                                                            data.cell23 = parseFloat((offerInfo.price / parseFloat(offerInfo.eur)).toFixed(2))
                                                            
                                                            data.cell41 = parseFloat((offerInfo.price * ce).toFixed(2))
                                                            data.cell42 = parseFloat((offerInfo.price * ce / data.cell32).toFixed(2))
                                                            data.cell43 = parseFloat((offerInfo.price * ce / data.cell33).toFixed(2))
                                                        }
                                                        else if(offerInfo.type == '$'){
                                                            data.cell21 = parseFloat(((offerInfo.price * parseFloat(offerInfo.usd))).toFixed(2))
                                                            data.cell22 = parseFloat(offerInfo.price.toFixed(2))
                                                            data.cell23 = parseFloat((offerInfo.price / (parseFloat(offerInfo.eur)/parseFloat(offerInfo.usd))).toFixed(2))
                                            
                                                            data.cell41 = parseFloat((offerInfo.price * data.cell32 * ce).toFixed(2))
                                                            data.cell42 = parseFloat((offerInfo.price * ce).toFixed(2))
                                                            data.cell43 = parseFloat((offerInfo.price * ce / (data.cell33/data.cell32)).toFixed(2))
                                                        }
                                                        else{
                                                            data.cell21 = parseFloat((offerInfo.price * parseFloat(offerInfo.eur)).toFixed(2))
                                                            data.cell22 = parseFloat((offerInfo.price * (parseFloat(offerInfo.eur)/parseFloat(offerInfo.usd))).toFixed(2))
                                                            data.cell23 = parseFloat(offerInfo.price.toFixed(2))
                                            
                                                            data.cell41 = parseFloat((offerInfo.price * ce * data.cell33).toFixed(2))
                                                            data.cell42 = parseFloat((offerInfo.price * ce * (data.cell33/data.cell32)).toFixed(2))
                                                            data.cell43 = parseFloat((offerInfo.price * ce).toFixed(2))
                                                        }
                                                        console.log('Data: ', data)

                                                        if(cb){
                                                            cb(ce, data, effect, prices, productInfo)
                                                        }
                                                        else{
                                                            ui.showOtherVals(price, data)
                                                        }
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        }
        else {
            ui.showOtherVals(price, data)
        }
    }
}