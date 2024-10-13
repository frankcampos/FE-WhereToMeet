import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createGroup } from "@/api/groups";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import "./GroupForm.css"
import { useMutation, useQueryClient } from "react-query";

export type GroupForm = {
  _id?: string; //primary key
  ownerId: string; //foreign key
  name: string;
  description: string;
  members: string[]; //array of _ids
}

export default function GroupForm() {
  const { user } = useAuth();

  const initFields: GroupForm = {
    ownerId: user._id,
    name: "",
    description: "",
    members: []
  };

  const [formFields, setFormFields] = useState<GroupForm>(initFields);

  const navigate = useNavigate()
  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  }

  // React Query Mutation for Caching / Syncing with Server
  const createGroupMutation = useMutation<ResponseType, Error, typeof formFields>({
    //@ts-ignore
    mutationFn: createGroup,
    onSuccess: (resp: any) => {
      // Update cache here
      queryClient.setQueryData(['groups', user._id], (oldData: any) => {
        const newGroup = {
          _id: resp.data.insertedId,
          dateCreated: resp.data.dateCreated,
          ...formFields
        };
        return oldData ? [...oldData, newGroup] : [newGroup];
      });
      queryClient.setQueryData(['group', resp.data._id], {
        _id: resp.data.insertedId,
        dateCreated: resp.data.dateCreated,
        ...formFields
      });
      navigate(`/groups/${resp.data.insertedId}`);
    },
    onError: (error: Error) => {
      console.error("Error submitting create group form: ", error);
    },
  });


  // const handleSelectMembers = (selectedMembers: string[]) => {
  //   setFormFields((prevFields) => ({
  //     ...prevFields,
  //     members: selectedMembers,
  //   }))
  // }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      createGroupMutation.mutate(formFields);
    } catch (err) {
      console.error("error submitting create group form: ", err)
    }
  }

  return (
    <div className="create-group-form-container">
      <h2 className="text-left" >Create a Group</h2>
      <form className="create-group-form" onSubmit={handleSubmit} style={{ marginTop: '2em' }}>

        {/* NAME FIELD */}
        <div className="form-group">
          <Label htmlFor="name" className="form-label">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formFields.name}
            onChange={handleChange}
            className="form-input"
            required
            aria-required="true"
            placeholder="The Taco Tuesday Crew"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="form-group">
          <Label htmlFor="description" className="form-label">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            className="form-input"
            aria-required="false"
            value={formFields.description}
            placeholder="We like to eat tacos on Tuesdays."
            onChange={handleChange}
          />
        </div>

        {/* <div>
          <MultiselectModal onSelectMembers={handleSelectMembers} />
          {formFields.members.length > 0 && (
            <p>{formFields.members.length} members selected</p>
          )}
        </div> */}

        <Button style={{ marginTop: "1em" }} type="submit" disabled={createGroupMutation.isLoading}>
          Submit
        </Button>
      </form>
    </div>
  );
}