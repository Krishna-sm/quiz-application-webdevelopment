 const option_container = document.getElementById("option_container")
 const question_heading = document.getElementById("question_heading")

const urlLocation = new URL(window.location.href)

let question_no =parseInt( urlLocation.searchParams.get("question") )||1
let questions = []
let answers =JSON.parse(localStorage.getItem("answers") || "[]")

function addAnswer(e){
        // console.log(e.target.value);
        
        const checkExist = answers.find((cur)=>{
           return cur.question === question_no
        })

        if(checkExist){

            const new_arr = answers.map((cur)=>{
                if(cur.question === question_no){
                    return {
                        ...cur,
            answer:e.target.value

                    }
                }
                return cur
            })

            answers = new_arr
        
        }

      else{
        const item = {
            question:question_no,
            answer:e.target.value
        }
        
        answers.push(item);
      }

        localStorage.setItem("answers",JSON.stringify(answers))
        console.log(answers);
        
        
        
}


const RenderQuestion = ()=>{
    if(!option_container || !question_heading) return
    // if(question_no>0 && question_no<=questions.length)
    try {
        question_heading.innerText = `${question_no}. ${questions[question_no-1].question} `

        let str = ''
        questions[question_no-1].options?.forEach((cur,index,array)=>{
                   
            const checkExist = answers?.find((curs)=>{
                return curs.question === question_no
            })

            if(checkExist?.answer === cur){
                str+=`
                <div class="mb-3">
            <input onchange="addAnswer(event)" checked type="radio" value="${cur}" name="answer" id="${index}"/>
                <label for="${index}">${cur}</label>
                </div>
    
    `
   
            }else{

                

            str+=`
                        <div class="mb-3">
                    <input onchange="addAnswer(event)"   type="radio" value="${cur}" name="answer" id="${index}"/>
                        <label for="${index}">${cur}</label>
                        </div>
            
                        `
                        }
            
        })
        option_container.innerHTML=str

        if(question_no<=1){
            document.getElementById("backBtn").style.display="none"
        }
        if(question_no>=questions.length){
            document.getElementById("nextBtn").style.display="none"
        }


        if(question_no===questions.length){
            document.getElementById("resultBtn").classList.remove("d-none")
        }

    } catch (error) {
        console.log(error);
        
    }
}

const FetchAllQuestion = async()=>{
        try {
                const response = await fetch('/api.json')
                const data =await response.json()
                questions=data
                RenderQuestion()
                ShowResult()
                
        } catch (error) {
            console.error(error.message);
            
        }
}


const backQuestion=()=>{
    if(question_no<=1) return
    window.location.href = `/index.html?question=${question_no-1}`
}
const nextQuestion=()=>{
    if(question_no>=questions.length) return

    window.location.href = `/index.html?question=${question_no+1}`

}

document.getElementById("backBtn")?.addEventListener('click',backQuestion)
document.getElementById("nextBtn")?.addEventListener('click',nextQuestion)

FetchAllQuestion()


// results 
const result_container = document.getElementById("result_container")
const outOfAnswer = document.getElementById("outOfAnswer")
const quote = document.getElementById("quote")
function ShowResult  (){
    if(!result_container) return

    if(answers.length<=0){
        result_container.innerHTML = `
            <h1 class="text-center"> 0 Question You Attempt </h1>

            <a href="/" class="btn btn-success">click here to attempt</a>
        `
        return
    }



    let str = ''
    let correctAnswers= 0

    for(let i=0;i<answers.length;i++){
        // console.log(questions[answers[i].question-1].question);
        const question_data = questions[answers[i].question-1]
        if(questions[answers[i].question-1].correctAnswer===answers[i].answer){
            correctAnswers++
        }
        
        str += `
                 <div class="alert alert-${questions[answers[i].question-1].correctAnswer===answers[i].answer?'success':'danger'}">
                                    <h4><strong>Ques:</strong> ${question_data.question}  </h1>
                                        <p> <strong>Ans:</strong> ${answers[i].answer} </p>
                                        <p> <strong>Valid Ans:</strong> ${questions[answers[i].question-1].correctAnswer} </p>


                                </div> 
        `
    }


    // let objofMsg = ['POOR','Excellence','Good']
    let msg = ''
    let percentage = (correctAnswers/answers.length)*100

    if(percentage<30){
        msg='POOR ! '
    }else if(percentage>30 && percentage<60){
        msg='Good :) '

    }else{
            msg='Excellence !'
    }

result_container.innerHTML = str
outOfAnswer.innerHTML  = `${correctAnswers}/${answers.length}`
quote.textContent = msg

    
}

function resetApplication(){
    answers = []
    localStorage.removeItem("answers")
    location.reload()
}