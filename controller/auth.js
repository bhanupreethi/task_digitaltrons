
const mysql = require('mysql');
const nodemailer = require('nodemailer');

var db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'bhanup',
    database : 'nodejs_users'
});

var transport = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'xxxx@gmail.com',
        pass: 'xxxx'
    }
})
db.connect((error)=>{
    if(error){
        console.log(error);
    } 
    console.log("DB COnn\'d");
});


exports.addUser = (req,res)=>{
    var{name,mail}=req.body;
    db.query('select * from users where mail = ?',[mail],
        (error,results)=>{
            if(error){
                console.log(error)
            }else{
                if(results.length>0){
                    res.send("Email alrady exists !");
                }else{
                    console.log('insert query');
                    db.query('insert into users set ?',{name : name,mail : mail},
                        (error,results)=>{
                            if(error){
                                console.log(error);
                            }else{
                                res.send('Inserted Successfully !');
                            }
                        })
                }
            }
        })
}

function getFolder(name, list){
    console.log(list)
    db.query('select * from angelList_Task where parent = ?',
    [name],(error,results)=>{
        if(error){
            console.log(error)
        } else {
            console.log(results);
            results.forEach((element)=>{
                if(element.Type=='File'){
                    list.push([element.Name]);
                } else {
                    let map = {[element.Name]: []};
                    list.push(map)
                    getFolder(element.Name, map[element.Name]);
                }
            });
        }
    })
}

function showFunc(name){
   
    db.query('select * from angelList_Task where parent=?',
    [name],(error,results)=>{
        if(error) {
            console.log(error)
        }else{
           console.log('- '+[name]);
           results.forEach((element)=>{
               if(element.Type=='File'){
                console.log('- '+element.Name);
               } else if(element.Type=='Folder'){
                   showFunc(element.Name);
               }
           })
        }
    })
}

function recFunc(parent){
   // result =result+ parent;
   
   // console.log(parent);
    db.query('select * from angelList_Task where parent = ?',[parent]
        ,(error,results)=>{
            if(error){
                console.log(error);
            } else{
                results.forEach((element) => {
                    if(element.Type='File'){
                        db.query('delete from angelList_Task where name = ?',[element.Name],
                        (error,results)=>{
                            if(error){
                                console.log(error)
                            }
                            if(results){
                                console.log('Deleted !');
                            }
                        })

                    }else{
                        db.query('delete from angelList_Task where parent = ?'
                            [element.Name],
                        (error,results)=>{
                            if(error){
                                console.log(error)
                            }
                            if(results){
                                console.log('Deleted !');
                            }
                        })
                        if(element.Type='Folder'){
                            db.query('delete from angelList_Task where name = ?'
                                [parent],
                            (error,results)=>{
                                if(error){
                                    console.log(error)
                                }
                                if(results){
                                    console.log('Deleted !');
                                }
                            })
                            recFunc(element.Name);
                        }
                         // fun foler parent cal
                        db.query('delete from angelList_Task where name = ?'
                            [element.Name],
                        (error,results)=>{
                            if(error){
                                console.log(error)
                            }
                            if(results){
                                console.log('Deleted !');
                            }
                        })
                       
                    }
                });
             // console.log(results[0].Name);
            }

    }); 

}

exports.add = (req,res)=>{
    let {name,parent,Type,User} = req.body;

    db.query('select * from users where name =?',[User],
        (error,results)=>{
            if(error){
                console.log(error)
            }else{
                if(results.length>0){
                    db.query('select * from users where name <> ?',[User],
                        (error,results)=>{
                            if(error){
                                console.log(error)
                            }else{
                                results.forEach((element)=>{
                                    const message = {
                                        from:'xxxx@gmail.com',
                                        to:element.mail,
                                        subject : 'Files Management',
                                        text : User+'  just added new File/Folder.'
                                    };
                                    transport.sendMail(message,(error,results)=>{
                                        if(error){
                                            console.log(error)
                                        }else{
                                            console.log(results)
                                        }
                                    });
                                })
                            }
                        })
                    //adding Files & Folders
                    if(parent==''){
                        db.query('insert into angelList_Task set ?',
                        {name : name,parent:null,Type:Type,User:User},(error, results)=>{
                            if(error){
                                console.log(error);
                            }
                            if(results){
                                res.send('Inserted Successfully !');
                            }
                        })
                    }else{
                        db.query('select parent from angelList_Task where Name = ?',[parent],
                            (error,results)=>{
                                if(error){
                                    console.log(error);
                                }
                                if(results.length > 0){
                                    db.query('insert into angelList_Task set ?',
                                    {name : name,parent:parent,Type:Type,User:User},(error, results)=>{
                                        if(error){
                                            console.log(error);
                                        }
                                        if(results){
                                            res.send('Inserted Successfully !');
                                        }
                                    })
                                }else{
                                    res.send([parent]+' not found');
                                }
                            })
                        
                    }
                }else{
                    res.send("user not exist !");
                }
            }
        })

}

exports.delete = (req,res)=>{
    let {name,Type} = req.body;
    if(Type == 'File'){
        db.query('delete from angelList_Task where name = ?',[name],
        (error,results)=>{
            if(error){
                console.log(error)
            }
            if(results){
                res.send('Deleted !');
            }
        })
    }else {
        var x = recFunc([name]);
        //console.log(result);
        res.send('Folder');
    }

}
exports.move = (req,res)=>{
    let{name,parent} = req.body;
     console.log([name],[parent]);
    db.query('select * from angelList_Task where name = ? and parent =?',
        [name,parent],(error,results)=>{
            if(error){
                console.log(error)
            }else{

               console.log(results[0].mail);

                res.send(results[0].mail);
            }
        });
    
}
exports.show = (req,res)=>{
    let {name} = req.body;

    let folderMap = {
        [name]: []
    };

    
  

   asynFunc(folderMap, name, res);

   
}

async function asynFunc(folderMap, name,res){

    console.log(folderMap,folderMap[name]);
    await getFolder(name, folderMap[name]);
    
    console.log('kkk', folderMap);
    
   res.send(folderMap);
}
