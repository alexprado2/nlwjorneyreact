import { Activity, CircleCheck, } from "lucide-react";
import { api } from "../../lib/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale'


interface Activity {
    date:string
    activities: {
        id:string
        title:string
        occurs_at: string
    }[]
}

export function Activities(){
    const {tripId} = useParams()
    const [activities,setactivities] = useState<Activity[]>([])
  
    useEffect(()=>{
      api.get(`/trips/${tripId}/activities`).then(response => setactivities(response.data.activities))
    },[tripId]) 
    return (
        <div className="space-y-8">

            {activities.map(categori =>{
                return(
                    <div key={categori.date} className="space-y2.5">
                            <div className="flex gap-2 items-baseline">
                                <span className="text-lx text-zinc-300 font-semibold">Dia {format(categori.date,'d')}</span>
                                <span className="text-xs text-zinc-500">{format(categori.date,'EEEE', {locale:ptBR})}</span>
                            </div>
                            {categori.activities.length > 0?(
                                <div>
                                    {categori.activities.map(activiti => {
                                        return (
                                    <div key={activiti.id} className="space-y-2.5">
                                     <div className="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
                                    <CircleCheck className="size-5 text-lime-300 "/>
                                    <span className="text-zinc-100">{activiti.title}</span>
                                    <span className="text-zinc-400 text-sm ml-auto">{format(activiti.occurs_at, 'HH:mm')}h</span>
                                </div>
                            </div>
                                        )
                                    })}
                                </div>

                            ):(
                            <p className="text-zinc-500 text-sm">Nenhuma atividade cadastrada nessa data.</p>
                            )}
                        </div>

                )
            } )}
                        
{/* 
                        <div className="space-y-2.5">
                            <div className="flex gap-2 items-baseline">
                                <span className="text-lx text-zinc-300 font-semibold">Dia 18</span>
                                <span className="text-xs text-zinc-500">Domingo</span>
                            </div>
                            <div className="space-y-2.5">
                                <div className="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
                                    <CircleCheck className="size-5 text-lime-300 "/>
                                    <span className="text-zinc-100">Academia em grupo</span>
                                    <span className="text-zinc-400 text-sm ml-auto">08:00h</span>
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <div className="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
                                    <CircleCheck className="size-5 text-lime-300 "/>
                                    <span className="text-zinc-100">Academia em grupo</span>
                                    <span className="text-zinc-400 text-sm ml-auto">08:00h</span>
                                </div>
                            </div>
                        </div> */}
                    </div>
    )
}
