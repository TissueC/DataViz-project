# coding: UTF-8 
"""
Created on Wed May  8 13:00:18 2019

@author: Administrator
"""
from flask import Flask, render_template, request
from flask import jsonify
from WhiteList import cityWhiteList,majorWhiteList

import pandas as pd

app = Flask(__name__)
app.config['SECRET_KEY'] = "dfdfdffdad"


loc_dict=dict()
with open('static/data/data_processed.txt','r') as f:
    lines=f.readlines()
    for line in lines:
        line=line.strip('\n').split(',')
        for whiteloc in cityWhiteList:
            if line[4].find(whiteloc)!=-1:
                line[4]=whiteloc
                break
        if line[1] not in loc_dict:
            loc_dict[line[1]]=list()
            loc_dict[line[1]].append({
                    'year':line[2]+'-'+line[3],
                    'city':line[4]})
        else:
            if loc_dict[line[1]][-1]['city']==line[4]:
                loc_dict[line[1]][-1]['year']=loc_dict[line[1]][-1]['year'][:5]+line[3]
            else:
                loc_dict[line[1]].append({
                    'year':line[2]+'-'+line[3],
                    'city':line[4]})


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/name',methods=['POST'])
def name():
    try:
        NameList=request.form['Name']
        NameList=NameList.split(',')
        dframe=pd.read_excel('static/data/数据.xlsx',index_col=0)
        result_list=list()
        for Name in NameList:
            cv=dframe.loc[Name,'履历']
            cv=cv.replace('\u3000','').replace(' ','').\
            replace('-','–').replace('―','–').replace('—','–').split('\n')
            exp_list=list()
            record_for_comp=list()
            know_from_flag=0
            know_to_flag=0
            for one_cv in cv:
                if not '0'<=one_cv[0]<='9':
                    continue
                exp_time=one_cv[:one_cv.find(',')]
                if exp_time[:exp_time.find('–')].split('.')==['']:
                    exp_time_from=[1960]
                    know_from_flag=0
                else:
                    exp_time_from=list(map(
                        int,exp_time[:exp_time.find('–')].split('.')))
                    know_from_flag=1
                if record_for_comp>exp_time_from:
                    continue
                if exp_time[exp_time.find('–')+1:].split('.')==['']:
                    exp_time_to=[2019,5]
                    know_to_flag=0
                else:
                    exp_time_to=list(map(
                        int,exp_time[exp_time.find('–')+1:].split('.')))
                    know_to_flag=1
                record_for_comp=exp_time_to
                exp=one_cv[one_cv.find(',')+1:]
                if (exp==''):
                    continue
                exp_list.append({'label':exp,
                             'from':exp_time_from,
                             'knowfrom':know_from_flag,
                             'to':exp_time_to,
                             'knowto':know_to_flag})
                
            result_list.append({'label':Name,
                                'sex' :dframe.loc[Name,'性别'],
                               'race':dframe.loc[Name,'民族'],
                                'career':dframe.loc[Name,'担任职务'],
                               'data':exp_list})
        return jsonify(result_list)
    except:
        return "error"
    

@app.route('/force',methods=['POST'])
def force():
    forceOption=request.form['label']
    if forceOption=='province':
        dframe=pd.read_excel('static/data/数据.xlsx')
        name_list=list(dframe['姓名'])
        hometown_list=list(dframe['出生地'])
        for i in range(len(hometown_list)):
            name_list[i]=name_list[i].strip('\u3000')
            if type(hometown_list[i])==str:
                hometown_list[i]=hometown_list[i][:2]
                if hometown_list[i]=='黑龙':
                    hometown_list[i]='黑龙江'
                if hometown_list[i]=='内蒙':
                    hometown_list[i]='内蒙古'
        result_list=list()
        for i in range(len(hometown_list)):
            if type(hometown_list[i])!=str:
                continue
            result_list.append({"source":hometown_list[i],
                    "target":name_list[i],
                    'value':30
                    })
        return jsonify(result_list)
    elif forceOption=='bornYear':
        dframe=pd.read_excel('static/data/数据.xlsx',dtype=str)
        name_list=list(dframe['姓名'])
        year_list=list(dframe['出生日期'])
        result_list=list()
        for i in range(len(year_list)):
            if year_list[i]=='nan' or year_list[i]!=year_list[i]:
                result_list.append({"source":'未知',
                            "target":name_list[i],
                            'value':30
                            })
            else:
                result_list.append({"source":year_list[i][:4],
                            "target":name_list[i],
                            'value':30
                            })
        return jsonify(result_list)
    elif forceOption=='college':
        dframe=pd.read_excel('static/data/数据.xlsx',dtype=str)
        name_list=list(dframe['姓名'])
        college_list=list(dframe['毕业院校'])
        result_list=list()
        for i in range(len(college_list)):
            if college_list[i]=='nan' or college_list[i]!=college_list[i]:
                result_list.append({"source":'未知',
                            "target":name_list[i],
                            'value':30
                            })
            else:
                if college_list[i].find(',')!=-1:
                    for coll in college_list[i].split(','):
                        result_list.append({"source":coll,
                            "target":name_list[i],
                            'value':30
                            })
                elif college_list[i].find('、')!=-1:
                    for coll in college_list[i].split('、'):
                        result_list.append({"source":coll,
                            "target":name_list[i],
                            'value':30
                            })
                else:
                    result_list.append({"source":college_list[i],
                            "target":name_list[i],
                            'value':30
                            })
        return jsonify(result_list)
    else:
        dframe=pd.read_excel('static/data/数据.xlsx',dtype=str)
        name_list=list(dframe['姓名'])
        major_list=list(dframe['专业背景'])
        result_list=list()
        for i in range(len(major_list)):
            if major_list[i]=='nan' or major_list[i]!=major_list[i]:
                result_list.append({"source":'未知',
                            "target":name_list[i],
                            'value':30
                            })
                continue
            flag=True
            for j in range(len(majorWhiteList)):
                if major_list[i].find(majorWhiteList[j])!=-1:
                    result_list.append({"source":majorWhiteList[j],
                            "target":name_list[i],
                            'value':30
                            })
                    flag=False
                    break
            if flag:
                result_list.append({"source":'未知',
                            "target":name_list[i],
                            'value':30
                            })
        return jsonify(result_list)
        

@app.route('/track',methods=['POST'])
def track():
    name=request.form['Name']
    return jsonify(loc_dict[name])

if __name__ == '__main__':
    app.run()