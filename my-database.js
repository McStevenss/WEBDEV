const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('database.db')

db.run(`
	CREATE TABLE IF NOT EXISTS faqs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		question TEXT,
		answer TEXT
    )
    `)

db.run(`
    CREATE TABLE IF NOT EXISTS blog (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post TEXT
    )
    `)

db.run(`
    CREATE TABLE IF NOT EXISTS guestbook (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entry TEXT,
        name TEXT
    )
`)

exports.getAllEntries = function(callback){
    const query = `
        SELECT * FROM guestbook
        ORDER BY id DESC
    `
    db.all(query,function(error,guestbook){
        callback(error,guestbook)
    })
}
exports.getEntryById = function(id,callback){
    const query = `
        SELECT * FROM guestbook WHERE id =?
    `
    db.get(query,[id],function(error,guestbook){
        callback(error,guestbook)
    })
}

exports.createEntry= function(entry,name, callback){
    const query = "INSERT INTO guestbook (entry,name) VALUES (?,?)"
    const values = [entry,name]
    
    db.run(query,values,function(error){
        callback(error)
    })
}

exports.deleteEntryWithId = function(id,callback){
    const query = `
    DELETE FROM guestbook WHERE id = ?
    `
    const values = [id]
    db.run(query,values,function(error){
        callback(error)
    })
}

exports.updateEntryWithId = function(entry,id,callback){
    const query = `
    UPDATE guestbook SET entry = ? WHERE id = ?
    `
    
    const values = [entry,id]
    
    db.run(query,values, function(error){
        callback(error)
    })
}

exports.getAllFaqs = function(callback){
    const query = `SELECT * FROM faqs
                   ORDER BY id DESC
    `
    db.all(query,function(error,faqs){
        callback(error,faqs)
    })
}


exports.getFaqById = function(id, callback){
    const query = "SELECT * FROM faqs WHERE id = ?"

    db.get(query, [id], function(error,faq){
        callback(error,faq)
    })
}


exports.updateFaqWithId = function(Question,Answer,id,callback){
    const query = `
    UPDATE faqs SET question = ?, answer = ? WHERE id = ?
    `
    
    const values = [Question,Answer,id]
    
    db.run(query,values, function(error){
        callback(error)
    })
}

exports.createFaq = function(question, answer, callback){
    const query = "INSERT INTO faqs (question, answer) VALUES (?, ?)"
    const values = [question,answer]
    
    db.run(query,values,function(error){
        callback(error)
    })
}

exports.deleteFaqWithId = function(id,callback){
    const query = `
    DELETE FROM faqs WHERE id = ?
    `
    const values = [id]
    db.run(query,values,function(error){
        callback(error)
    })
}



exports.createPost = function(post, callback){
    const query = "INSERT INTO blog (post) VALUES (?)"
    const value = [post]
    
    db.run(query,value,function(error){
        callback(error)
    })
}


exports.getAllPosts = function(callback){
    const query = `SELECT * FROM blog
                   ORDER BY id DESC
    `
    db.all(query,function(error,blog){
        callback(error,blog)
    })
}

exports.getPostById = function(id, callback){
    const query = "SELECT * FROM blog WHERE id = ?"
                  
    db.get(query, [id], function(error, BlogPost){
        callback(error,BlogPost)
    })
}

exports.updatePostWithId = function(blogPost,id,callback){
    const query = `
    UPDATE blog SET post = ? WHERE id = ?
    `
    
    const values = [blogPost,id]
    
    db.run(query,values, function(error){
        callback(error)
    })
}

exports.deletePostWithId = function(id,callback){
    const query = `
    DELETE FROM blog WHERE id = ?
    `
    const values = [id]
    db.run(query,values,function(error){
        callback(error)
    })
}

exports.getLatestPost = function(callback){
    const query = `
    SELECT * FROM blog
    ORDER BY id DESC
	LIMIT 1
    `
    db.all(query,function(error, blog){
        callback(error, blog)
    })
}

