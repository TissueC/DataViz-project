var nameList=[];

function newChart(data){
    const element = document.getElementById('chart');
    var newData=[]
    for(var i=0;i<data.length;i++)
    {
        var charactor=data[i];
        cv=[];
        for (var j=0;j<charactor.data.length;j++)
        {
            cv.push({
                label:charactor.data[j].label,
                type: TimelineChart.TYPE.INTERVAL,
                knowfrom: charactor.data[j].knowfrom,
                knowto: charactor.data[j].knowto,
                from: new Date(charactor.data[j].from),
                to:new Date(charactor.data[j].to)
            });
        }
        newData.push({
            label:charactor.label,
            sex:charactor.sex,
            race:charactor.race,
            career:charactor.career,
            data:cv
        });
    }
    console.log(newData);

    const timeline = new TimelineChart(element, newData, {
        enableLiveTimer: true,
        tip: function(d) {
        	//lineNum=d.label.length/15;
        	//for(var i=0;i<lineNum;i++)
        	//	d.label=d.label.slice(0,15*(i+1))+'<br>'+d.label.slice(15*(i+1));
        	if (d.knowfrom==1&&d.knowto==1){
            	return `履历：${d.label}<br> 时间从 ${d.from.getFullYear()}年${d.from.getMonth()+1}月 到 ${d.to.getFullYear()}年${d.to.getMonth()+1}月`;
        	}
        	else if (d.knowfrom){
        		return `履历：${d.label}<br> 时间从 ${d.from.getFullYear()}年${d.from.getMonth()+1}月 至今`;
        	}
        	else if (d.knowto){
        		return `履历：${d.label}<br> 时间从 未知 到 ${d.to.getFullYear()}年${d.to.getMonth()+1}月`;
        	}
        	else {
        		return `履历：${d.label}<br> 时间从 未知 至今`;
        	}
        },
        label_tip: function(d){
            return `${d.sex},${d.race}<br>现任${d.career}<br>点击打开该委员百度百科`;
        }
    }).onVizChange(e => console.log(e));
}


function refreshChart2(){
    if (nameList.length==0)
    {
        data=[];
        newChart(data);
        return;
    }
    tmpList=[];
    for(var i=0;i<nameList.length-1;i++)
    {
        if (nameList[i]!=nameList[nameList.length-1]){
            tmpList.push(nameList[i]);
        }
    }
    tmpList.push(nameList[nameList.length-1]);
    nameList=tmpList;
    $.post("/name", {"Name": nameList.join(',')}, 
            function(data, status){
                console.log(data);
                if (data=='error'){
                    alert('未查询到该中央委员！\n请输入正确的委员名或者在右下角视图中点击小圆查询！')
                    nameList.pop();
                    if (nameList.length==0){
                        data=[];
                        newChart(data);
                    }
                    return;
                }
            newChart(data);
        

            d3.selectAll('.deleteBtns')
            .on('click',function(d,i){
                nameList.splice(i,1);
                newChart(data);
                refreshChart2();
            });
        });
}

function refreshChart(){
    if (nameList.length==0)
    {
        data=[];
        newChart(data);
        return;
    }
    tmpList=[];
    for(var i=0;i<nameList.length-1;i++)
    {
        if (nameList[i]!=nameList[nameList.length-1]){
            tmpList.push(nameList[i]);
        }
    }
    tmpList.push(nameList[nameList.length-1]);
    nameList=tmpList;
    $.post("/name", {"Name": nameList.join(',')}, 
            function(data, status){
                console.log(data);
                if (data=='error'){
                    alert('未查询到该中央委员！\n 请输入正确的委员名或者在右下角视图中点击小圆查询！')
                    nameList.pop();
                    if (nameList.length==0){
                        data=[];
                        newChart(data);
                    }
                    return;
                }
            newChart(data);
        	refreshMap(data[data.length-1].label);
        

            d3.selectAll('.deleteBtns')
            .on('click',function(d,i){
                nameList.splice(i,1);
                newChart(data);
                refreshChart2();
            });
        });
}

$(document).ready(function(){
    addBtnNum=0;
    /*
    $(".addBtn").click(function(){
    	
        $(".ADD").append( "<div id='addDiv"+(addBtnNum)+
    		"'"+"><br/>常委名字 <input type='text' class='addName'  \
    		placeholder='Name'> <button id='deleteBtn"+(addBtnNum)+
    		"'"+" class='deleteBtn'>删除</button></div>");
        

    	$("#deleteBtn"+addBtnNum).click(function(){
        	var deleteID=$(this).attr("id");
        	deleteID=deleteID.substr(9);
        	$("#addDiv"+deleteID).remove();


    	});
    	addBtnNum++;
    });
    */
    

    $(".addBtn").click(function(){
        var addNameList=$(".addName");
        //var nameList=[];
        for (var i=0;i<addNameList.length;i++)
        {
            nameList.push((addNameList[i].value));
        }
        refreshChart(); 
    });
})
