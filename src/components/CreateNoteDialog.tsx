'use client'

import React from 'react'
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './ui/dialog'
import { Loader2, PlusIcon } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type Props = {}

const CreateNoteDialog = (props: Props) => {

  const [input, setInput] = React.useState("")
  const router = useRouter()
  const uploadToFirebase = useMutation({
    mutationFn: async (noteId: string) => {
      const response = await axios.post('/api/uploadToFirebase', { noteId })
      return response.data
    }
  })

  const createNotebook = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/createNoteBook', {
        name: input,
      })
      return response.data
    }
  })

  const handleSubmit = ((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === '') {
      window.alert("Please enter a name for your notebook")
      return
    }
    
    createNotebook.mutate(undefined, {
      onSuccess: async ({note_id}) => {
        console.log("created new note:", {note_id});
        try {
          const uploadResponse = await uploadToFirebase.mutateAsync(note_id);
          // Assuming uploadResponse now contains the Firebase URL, update accordingly
          console.log("Image uploaded to Firebase:", uploadResponse);
          // Here, update the state or database with the new URL before routing
        } catch (error) {
          console.error("Failed to upload to Firebase:", error);
          window.alert("Failed to upload image to Firebase");
        }
        router.push(`/notebook/${note_id}`);
      },
      onError: (error) => {
        console.error(error);
        window.alert("Failed to create new notebook");
      } 
    })
  })

  return (
    <Dialog>
      <DialogTrigger>
        <div className='border-dashed border-2 flex border-emerald-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4'>
          <PlusIcon className='w-6 h-6 text-emerald-600' strokeWidth={3} />
          <h2 className='font-semibold text-emerald-600 sm:mt-2'>New Notebook</h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            New Notebook
          </DialogTitle>
          <DialogDescription>
            You can create a new note by clicking the button below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input 
            placeholder='Name...' 
            value={input}
            onChange={e => setInput(e.target.value)}
            />
          <div className="h-4"></div>
          <div className="flex items-center gap-2">
            <Button type="reset" variant={'secondary'}>Cancel</Button>
            <Button type="submit" className='bg-emerald-600' disabled={createNotebook.isPending}>
              {createNotebook.isPending ? (
                <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Creating...</>
              ) : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateNoteDialog